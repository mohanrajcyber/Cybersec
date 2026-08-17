import { jsPDF } from 'jspdf'
import { TRAINER } from '../data/trainer'
import { ICT_SESSION } from '../data/sessionPlan'

export function generateReportCard(students, { collegeName = ICT_SESSION.venue } = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()

  doc.setFontSize(16)
  doc.setTextColor(30, 58, 138)
  doc.text('CyberSec Arena — Class Report Card', w / 2, 18, { align: 'center' })
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text(`${ICT_SESSION.program} · Batch ${ICT_SESSION.batchId}`, w / 2, 24, { align: 'center' })
  doc.text(collegeName, w / 2, 30, { align: 'center' })
  doc.text(`Trainer: ${TRAINER.name} · ${TRAINER.vendor} · ${new Date().toLocaleDateString('en-IN')}`, w / 2, 36, { align: 'center' })

  const cols = ['#', 'Username', 'Name', 'Score', 'Labs', 'Badges']
  const colX = [12, 22, 55, 120, 145, 165]
  let y = 48

  doc.setFillColor(30, 58, 138)
  doc.rect(10, y - 5, w - 20, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  cols.forEach((c, i) => doc.text(c, colX[i], y))

  y += 8
  doc.setTextColor(30, 30, 30)
  students.forEach((s, i) => {
    if (y > 275) {
      doc.addPage()
      y = 20
    }
    const row = [
      String(i + 1),
      `@${s.username}`,
      (s.displayName || s.name || '—').slice(0, 28),
      `${s.score ?? 0}%`,
      String(s.completedLabs?.length || 0),
      String(s.badges?.length || 0),
    ]
    if (i % 2 === 0) {
      doc.setFillColor(245, 247, 250)
      doc.rect(10, y - 4, w - 20, 7, 'F')
    }
    doc.setFontSize(8)
    row.forEach((cell, ci) => doc.text(cell, colX[ci], y))
    y += 7
  })

  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(`Total students: ${students.length} · ICT Academy CyberSec Arena`, w / 2, 290, { align: 'center' })
  doc.save(`CyberSec-ReportCard-${Date.now()}.pdf`)
}
