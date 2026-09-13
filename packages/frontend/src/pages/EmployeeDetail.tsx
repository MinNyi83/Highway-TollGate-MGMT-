import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Mail, Calendar, Building2, Briefcase, DollarSign, Clock, FileText, Award, BookOpen } from 'lucide-react';
import api from '../lib/api';
import { CardSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  ON_LEAVE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  TERMINATED: 'bg-red-500/20 text-red-400 border-red-500/30',
  INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const leaveStatusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const payrollStatusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  PROCESSED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const attendanceStatusColors: Record<string, string> = {
  PRESENT: 'bg-emerald-500/20 text-emerald-400',
  ABSENT: 'bg-red-500/20 text-red-400',
  LATE: 'bg-amber-500/20 text-amber-400',
  HALF_DAY: 'bg-orange-500/20 text-orange-400',
  ON_LEAVE: 'bg-purple-500/20 text-purple-400',
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leave', label: 'Leave', icon: FileText },
  { id: 'payroll', label: 'Payroll', icon: DollarSign },
  { id: 'performance', label: 'Performance', icon: Award },
  { id: 'training', label: 'Training', icon: BookOpen },
];

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: employee, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-employee', id],
    queryFn: async () => {
      const res = await api.get(`/hr/employees/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6"><CardSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;
  if (!employee) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message="Employee not found" /></div>;

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <Link to="/hr/employees" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft size={16} /> Back to Employees
      </Link>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{employee.firstName} {employee.lastName}</h1>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border w-fit ${statusColors[employee.status] || ''}`}>
                {employee.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-mono mb-3">{employee.employeeNumber}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5"><Building2 size={14} className="text-gray-500" /> {employee.department?.name || '-'}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-gray-500" /> {employee.position?.title || '-'}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-500" /> {employee.email}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-500" /> Hired {new Date(employee.hireDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-800/60 p-1 rounded-xl w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Full Name</span><span className="text-white">{employee.firstName} {employee.lastName}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="text-white">{employee.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-white">{employee.phone || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date of Birth</span><span className="text-white">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Gender</span><span className="text-white">{employee.gender || '-'}</span></div>
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Employment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Department</span><span className="text-white">{employee.department?.name || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Position</span><span className="text-white">{employee.position?.title || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Manager</span><span className="text-white">{employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Hire Date</span><span className="text-white">{new Date(employee.hireDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Salary</span><span className="text-white">{employee.salary ? `K${Number(employee.salary).toLocaleString()}` : '-'}</span></div>
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact & Address</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Address</span><span className="text-white text-right max-w-[200px]">{employee.address || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">City</span><span className="text-white">{employee.city || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">State</span><span className="text-white">{employee.state || '-'}</span></div>
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="text-white">{employee.emergencyContactName || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-white">{employee.emergencyContactPhone || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Relationship</span><span className="text-white">{employee.emergencyContactRelation || '-'}</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Attendance (Last 30 Days)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/60 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Clock In</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Clock Out</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Hours</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employee.attendances?.map((a: any) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{a.clockIn ? new Date(a.clockIn).toLocaleTimeString() : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{a.clockOut ? new Date(a.clockOut).toLocaleTimeString() : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{a.hoursWorked || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${attendanceStatusColors[a.status] || ''}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!employee.attendances || employee.attendances.length === 0) && (
            <div className="p-8 text-center text-gray-500">No attendance records</div>
          )}
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Leave Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/60 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Start</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">End</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Days</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employee.leaveRequests?.map((l: any) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{l.leaveType}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{new Date(l.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{new Date(l.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{l.days}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${leaveStatusColors[l.status] || ''}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!employee.leaveRequests || employee.leaveRequests.length === 0) && (
            <div className="p-8 text-center text-gray-500">No leave requests</div>
          )}
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Payroll History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/60 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Period</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Base Salary</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Allowances</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Net Pay</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employee.payrolls?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-mono">{p.payPeriod}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">K{Number(p.baseSalary).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">K{Number(p.allowances || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">K{Number(p.deductions || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">K{Number(p.netPay).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${payrollStatusColors[p.status] || ''}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!employee.payrolls || employee.payrolls.length === 0) && (
            <div className="p-8 text-center text-gray-500">No payroll records</div>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Performance Reviews</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/60 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Period</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Rating</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Comments</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employee.performances?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{r.period}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{r.rating}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{r.comments || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!employee.performances || employee.performances.length === 0) && (
            <div className="p-8 text-center text-gray-500">No performance reviews</div>
          )}
        </div>
      )}

      {activeTab === 'training' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Training Enrollments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/60 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Training</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Code</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Enrolled</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employee.trainingEnrollments?.map((e: any) => (
                  <tr key={e.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{e.training?.title || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">{e.training?.code || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        e.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        e.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{e.score || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!employee.trainingEnrollments || employee.trainingEnrollments.length === 0) && (
            <div className="p-8 text-center text-gray-500">No training enrollments</div>
          )}
        </div>
      )}
    </div>
  );
}
