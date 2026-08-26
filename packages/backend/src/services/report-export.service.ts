import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import { logger } from '../utils/logger';

interface ReportOptions {
  format: 'pdf' | 'excel';
  startDate: Date;
  endDate: Date;
  type: 'revenue' | 'trips' | 'violations' | 'fleet';
  filters?: any;
}

export class ReportExportService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generateReport(options: ReportOptions): Promise<Buffer> {
    switch (options.format) {
      case 'pdf':
        return this.generatePDFReport(options);
      case 'excel':
        return this.generateExcelReport(options);
      default:
        throw new Error('Unsupported format');
    }
  }

  private async generatePDFReport(options: ReportOptions): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    doc.pipe(stream);

    stream.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(20).text('TollGate Management System', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`${this.getReportTitle(options.type)} Report`, {
      align: 'center',
    });
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        `Period: ${options.startDate.toLocaleDateString()} - ${options.endDate.toLocaleDateString()}`,
        { align: 'center' }
      );
    doc.moveDown(2);

    // Report content
    switch (options.type) {
      case 'revenue':
        await this.generateRevenuePDF(doc, options);
        break;
      case 'trips':
        await this.generateTripsPDF(doc, options);
        break;
      case 'violations':
        await this.generateViolationsPDF(doc, options);
        break;
      case 'fleet':
        await this.generateFleetPDF(doc, options);
        break;
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  private async generateRevenuePDF(doc: PDFKit.PDFDocument, options: ReportOptions): Promise<void> {
    const revenueData = await this.getRevenueData(options);

    doc.fontSize(14).text('Revenue Summary');
    doc.moveDown();

    // Summary table
    doc.fontSize(10);
    doc.text(`Total Revenue: MMK ${revenueData.totalRevenue.toLocaleString()}`);
    doc.text(`Total Transactions: ${revenueData.totalTransactions}`);
    doc.text(`Average Transaction: MMK ${revenueData.averageTransaction.toLocaleString()}`);
    doc.moveDown();

    // Revenue by plaza
    doc.fontSize(12).text('Revenue by Plaza');
    doc.moveDown();

    revenueData.byPlaza.forEach((plaza) => {
      doc.fontSize(10).text(`${plaza.name}: MMK ${plaza.revenue.toLocaleString()} (${plaza.transactions} transactions)`);
    });

    doc.moveDown();

    // Revenue by vehicle class
    doc.fontSize(12).text('Revenue by Vehicle Class');
    doc.moveDown();

    revenueData.byVehicleClass.forEach((vc) => {
      doc.fontSize(10).text(`${vc.vehicleClass}: MMK ${vc.revenue.toLocaleString()} (${vc.count} vehicles)`);
    });
  }

  private async generateTripsPDF(doc: PDFKit.PDFDocument, options: ReportOptions): Promise<void> {
    const tripsData = await this.getTripsData(options);

    doc.fontSize(14).text('Trip Summary');
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Total Trips: ${tripsData.totalTrips}`);
    doc.text(`Average Trip Length: ${tripsData.averageTripLength.toFixed(1)} km`);
    doc.text(`Peak Hour: ${tripsData.peakHour}`);
    doc.moveDown();

    // Trips by plaza
    doc.fontSize(12).text('Trips by Plaza');
    doc.moveDown();

    tripsData.byPlaza.forEach((plaza) => {
      doc.fontSize(10).text(`${plaza.name}: ${plaza.trips} trips`);
    });
  }

  private async generateViolationsPDF(doc: PDFKit.PDFDocument, options: ReportOptions): Promise<void> {
    const violationsData = await this.getViolationsData(options);

    doc.fontSize(14).text('Violations Summary');
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Total Violations: ${violationsData.totalViolations}`);
    doc.text(`Pending: ${violationsData.pending}`);
    doc.text(`Resolved: ${violationsData.resolved}`);
    doc.text(`Total Fines: MMK ${violationsData.totalFines.toLocaleString()}`);
    doc.moveDown();

    // Violations by type
    doc.fontSize(12).text('Violations by Type');
    doc.moveDown();

    violationsData.byType.forEach((vt) => {
      doc.fontSize(10).text(`${vt.type}: ${vt.count} (MMK ${vt.fines.toLocaleString()})`);
    });
  }

  private async generateFleetPDF(doc: PDFKit.PDFDocument, options: ReportOptions): Promise<void> {
    const fleetData = await this.getFleetData(options);

    doc.fontSize(14).text('Fleet Summary');
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Total Vehicles: ${fleetData.totalVehicles}`);
    doc.text(`Active Vehicles: ${fleetData.activeVehicles}`);
    doc.text(`Total Trips: ${fleetData.totalTrips}`);
    doc.text(`Total Spending: MMK ${fleetData.totalSpending.toLocaleString()}`);
    doc.moveDown();

    // Top vehicles by trips
    doc.fontSize(12).text('Top Vehicles by Trips');
    doc.moveDown();

    fleetData.topVehicles.slice(0, 10).forEach((v, i) => {
      doc.fontSize(10).text(`${i + 1}. ${v.plateNumber}: ${v.trips} trips (MMK ${v.spending.toLocaleString()})`);
    });
  }

  private async generateExcelReport(options: ReportOptions): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TollGate Management System';
    workbook.created = new Date();

    switch (options.type) {
      case 'revenue':
        await this.generateRevenueExcel(workbook, options);
        break;
      case 'trips':
        await this.generateTripsExcel(workbook, options);
        break;
      case 'violations':
        await this.generateViolationsExcel(workbook, options);
        break;
      case 'fleet':
        await this.generateFleetExcel(workbook, options);
        break;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async generateRevenueExcel(workbook: ExcelJS.Workbook, options: ReportOptions): Promise<void> {
    const revenueData = await this.getRevenueData(options);

    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ];

    summarySheet.addRow({ metric: 'Total Revenue', value: revenueData.totalRevenue });
    summarySheet.addRow({ metric: 'Total Transactions', value: revenueData.totalTransactions });
    summarySheet.addRow({ metric: 'Average Transaction', value: revenueData.averageTransaction });

    // Plaza sheet
    const plazaSheet = workbook.addWorksheet('Revenue by Plaza');
    plazaSheet.columns = [
      { header: 'Plaza', key: 'name', width: 30 },
      { header: 'Revenue (MMK)', key: 'revenue', width: 20 },
      { header: 'Transactions', key: 'transactions', width: 15 },
    ];

    revenueData.byPlaza.forEach((plaza) => {
      plazaSheet.addRow(plaza);
    });

    // Vehicle class sheet
    const vcSheet = workbook.addWorksheet('Revenue by Vehicle Class');
    vcSheet.columns = [
      { header: 'Vehicle Class', key: 'vehicleClass', width: 20 },
      { header: 'Revenue (MMK)', key: 'revenue', width: 20 },
      { header: 'Count', key: 'count', width: 10 },
    ];

    revenueData.byVehicleClass.forEach((vc) => {
      vcSheet.addRow(vc);
    });
  }

  private async generateTripsExcel(workbook: ExcelJS.Workbook, options: ReportOptions): Promise<void> {
    const tripsData = await this.getTripsData(options);

    const sheet = workbook.addWorksheet('Trips');
    sheet.columns = [
      { header: 'Plaza', key: 'name', width: 30 },
      { header: 'Trips', key: 'trips', width: 15 },
      { header: 'Average Duration (min)', key: 'avgDuration', width: 25 },
    ];

    tripsData.byPlaza.forEach((plaza) => {
      sheet.addRow(plaza);
    });
  }

  private async generateViolationsExcel(workbook: ExcelJS.Workbook, options: ReportOptions): Promise<void> {
    const violationsData = await this.getViolationsData(options);

    const sheet = workbook.addWorksheet('Violations');
    sheet.columns = [
      { header: 'Type', key: 'type', width: 30 },
      { header: 'Count', key: 'count', width: 10 },
      { header: 'Fines (MMK)', key: 'fines', width: 20 },
    ];

    violationsData.byType.forEach((vt) => {
      sheet.addRow(vt);
    });
  }

  private async generateFleetExcel(workbook: ExcelJS.Workbook, options: ReportOptions): Promise<void> {
    const fleetData = await this.getFleetData(options);

    const sheet = workbook.addWorksheet('Fleet');
    sheet.columns = [
      { header: 'Plate Number', key: 'plateNumber', width: 20 },
      { header: 'Trips', key: 'trips', width: 10 },
      { header: 'Spending (MMK)', key: 'spending', width: 20 },
    ];

    fleetData.topVehicles.forEach((v) => {
      sheet.addRow(v);
    });
  }

  private async getRevenueData(options: ReportOptions): Promise<any> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: { gte: options.startDate, lte: options.endDate },
        type: 'DEBIT',
      },
      include: {
        event: {
          include: { plaza: true, vehicle: true },
        },
      },
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalTransactions = transactions.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Group by plaza
    const byPlazaMap = new Map<string, { name: string; revenue: number; transactions: number }>();
    transactions.forEach((t) => {
      const plazaName = t.event?.plaza?.name || 'Unknown';
      const existing = byPlazaMap.get(plazaName) || { name: plazaName, revenue: 0, transactions: 0 };
      existing.revenue += Number(t.amount);
      existing.transactions += 1;
      byPlazaMap.set(plazaName, existing);
    });

    // Group by vehicle class
    const byVCMap = new Map<string, { vehicleClass: string; revenue: number; count: number }>();
    transactions.forEach((t) => {
      const vc = t.event?.vehicle?.vehicleClass || 'Unknown';
      const existing = byVCMap.get(vc) || { vehicleClass: vc, revenue: 0, count: 0 };
      existing.revenue += Number(t.amount);
      existing.count += 1;
      byVCMap.set(vc, existing);
    });

    return {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      byPlaza: Array.from(byPlazaMap.values()),
      byVehicleClass: Array.from(byVCMap.values()),
    };
  }

  private async getTripsData(options: ReportOptions): Promise<any> {
    const events = await this.prisma.tollEvent.findMany({
      where: {
        entryTime: { gte: options.startDate, lte: options.endDate },
        status: 'COMPLETED',
      },
      include: { plaza: true },
    });

    const totalTrips = events.length;

    // Group by plaza
    const byPlazaMap = new Map<string, { name: string; trips: number; totalDuration: number }>();
    events.forEach((e) => {
      const plazaName = e.plaza?.name || 'Unknown';
      const existing = byPlazaMap.get(plazaName) || { name: plazaName, trips: 0, totalDuration: 0 };
      existing.trips += 1;
      if (e.exitTime) {
        existing.totalDuration += (e.exitTime.getTime() - e.entryTime.getTime()) / 60000;
      }
      byPlazaMap.set(plazaName, existing);
    });

    const byPlaza = Array.from(byPlazaMap.values()).map((p) => ({
      ...p,
      avgDuration: p.trips > 0 ? p.totalDuration / p.trips : 0,
    }));

    // Find peak hour
    const hourCounts = new Array(24).fill(0);
    events.forEach((e) => {
      hourCounts[e.entryTime.getHours()] += 1;
    });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    return {
      totalTrips,
      averageTripLength: 15, // Placeholder - would need GPS data
      peakHour: `${peakHour}:00 - ${peakHour + 1}:00`,
      byPlaza,
    };
  }

  private async getViolationsData(options: ReportOptions): Promise<any> {
    const violations = await this.prisma.violation.findMany({
      where: {
        createdAt: { gte: options.startDate, lte: options.endDate },
      },
    });

    const totalViolations = violations.length;
    const pending = violations.filter((v) => v.status === 'PENDING').length;
    const resolved = violations.filter((v) => v.status === 'RESOLVED').length;
    const totalFines = violations.reduce((sum, v) => sum + Number(v.fineAmount), 0);

    // Group by type
    const byTypeMap = new Map<string, { type: string; count: number; fines: number }>();
    violations.forEach((v) => {
      const existing = byTypeMap.get(v.violationType) || { type: v.violationType, count: 0, fines: 0 };
      existing.count += 1;
      existing.fines += Number(v.fineAmount);
      byTypeMap.set(v.violationType, existing);
    });

    return {
      totalViolations,
      pending,
      resolved,
      totalFines,
      byType: Array.from(byTypeMap.values()),
    };
  }

  private async getFleetData(options: ReportOptions): Promise<any> {
    const events = await this.prisma.tollEvent.findMany({
      where: {
        entryTime: { gte: options.startDate, lte: options.endDate },
        status: 'COMPLETED',
      },
      include: {
        vehicle: true,
      },
    });

    // Group by vehicle
    const vehicleMap = new Map<string, { plateNumber: string; trips: number; spending: number }>();
    events.forEach((e) => {
      if (!e.vehicle) return;
      const existing = vehicleMap.get(e.vehicleId) || {
        plateNumber: e.vehicle.plateNumber,
        trips: 0,
        spending: 0,
      };
      existing.trips += 1;
      existing.spending += Number(e.amount || 0);
      vehicleMap.set(e.vehicleId, existing);
    });

    const topVehicles = Array.from(vehicleMap.values())
      .sort((a, b) => b.trips - a.trips);

    const totalVehicles = await this.prisma.vehicle.count();
    const activeVehicles = new Set(events.map((e) => e.vehicleId)).size;

    return {
      totalVehicles,
      activeVehicles,
      totalTrips: events.length,
      totalSpending: topVehicles.reduce((sum, v) => sum + v.spending, 0),
      topVehicles,
    };
  }

  private getReportTitle(type: string): string {
    switch (type) {
      case 'revenue':
        return 'Revenue';
      case 'trips':
        return 'Trips';
      case 'violations':
        return 'Violations';
      case 'fleet':
        return 'Fleet';
      default:
        return 'Report';
    }
  }
}
