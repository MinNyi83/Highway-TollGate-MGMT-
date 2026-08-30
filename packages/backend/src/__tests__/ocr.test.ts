import request from 'supertest';
import app from '../app';
import { OcrDocumentService } from '../services/ocr-document.service';

describe('OCR & Myanmar RTAD Document Scanning (Front & Back)', () => {
  const frontSideText = `
ကုန်းလမ်းပို့ဆောင်ရေးညွှန်ကြားမှုဦးစီးဌာန
Road Transport Administration Department
(Registration Certificate of a Motor Vehicle)
Plate No 4D/5918
Model Year 2009
Make & Model HONDA CIVIC FD3
Vehicle Type SALOON(4X2)(R)
Location Y2
YGN
  `.trim();

  const backSideText = `
Engine No LDA-1372845
Chassis No FD3-1302842
Color GRAY
Gross Vehicle Weight 1270 Kg + 4P
Use Character Private
Engine Power - 1339 CC
Owner U NYI NYI MIN
Address B-28/R-89, MUDITAR HOUSING ST, YWAR MA WEST QTR, INSEIN TSP.
(INSEIN)
Valid up to 30/06/2026
Issue Date 04/06/2024
1A8648800
  `.trim();

  it('should parse Front Side RTAD Card (Plate, Model Year, Make, Model, Type)', () => {
    const result = OcrDocumentService.parseRtadText(frontSideText);

    expect(result.plateNumber).toBe('4D-5918');
    expect(result.make).toBe('Honda');
    expect(result.year).toBe(2009);
    expect(result.vehicleClass).toBe('SEDAN');
    expect(result.vehicleType).toBe('SALOON(4X2)(R)');
    expect(result.documentSide).toBe('FRONT');
  });

  it('should parse Back Side RTAD Card (Engine No, Chassis No, Owner, Expiry, Weight)', () => {
    const result = OcrDocumentService.parseRtadText(backSideText);

    expect(result.make).toBe('Honda');
    expect(result.color).toBe('Gray');
    expect(result.vehicleClass).toBe('SEDAN');
    expect(result.engineNumber).toBe('LDA-1372845');
    expect(result.chassisNumber).toBe('FD3-1302842');
    expect(result.ownerName).toBe('U NYI NYI MIN');
    expect(result.expiryDate).toBe('30/06/2026');
    expect(result.documentSide).toBe('BACK');
  });

  it('should parse Combined Front & Back text via POST /api/ocr/scan-wheel-tax', async () => {
    const combinedText = `${frontSideText}\n\n${backSideText}`;
    const response = await request(app)
      .post('/api/ocr/scan-wheel-tax')
      .send({ rawText: combinedText });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.plateNumber).toBe('4D-5918');
    expect(response.body.data.make).toBe('Honda');
    expect(response.body.data.year).toBe(2009);
    expect(response.body.data.color).toBe('Gray');
    expect(response.body.data.vehicleClass).toBe('SEDAN');
    expect(response.body.data.ownerName).toBe('U NYI NYI MIN');
  });
});
