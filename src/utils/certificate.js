import { jsPDF } from 'jspdf'
import { TRAINER } from '../data/trainer'
import { ICT_SESSION } from '../data/sessionPlan'

export function generateCertificate({ studentName, username, date = new Date() }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()

  doc.setFillColor(30, 58, 138)
  doc.rect(0, 0, w, h, 'F')
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(1.5)
  doc.rect(10, 10, w - 20, h - 20)
  doc.setLineWidth(0.5)
  doc.rect(14, 14, w - 28, h - 28)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.text('ICT ACADEMY · IBM ADULT LEARNER 2026-27', w / 2, 28, { align: 'center' })
  doc.setFontSize(9)
  doc.setTextColor(200, 210, 230)
  doc.text(`Batch ${ICT_SESSION.batchId} · ${ICT_SESSION.venue}`, w / 2, 36, { align: 'center' })

  doc.setFontSize(26)
  doc.setTextColor(255, 255, 255)
  doc.text('Certificate of Completion', w / 2, 52, { align: 'center' })

  doc.setFontSize(12)
  doc.setTextColor(200, 210, 230)
  doc.text('This is to certify that', w / 2, 66, { align: 'center' })

  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text(studentName, w / 2, 80, { align: 'center' })

  doc.setFontSize(11)
  doc.setTextColor(200, 210, 230)
  doc.text(`Username: @${username}`, w / 2, 90, { align: 'center' })
  doc.text('has successfully completed the ICT approved', w / 2, 98, { align: 'center' })

  doc.setFontSize(15)
  doc.setTextColor(255, 255, 255)
  doc.text('3-Day Cyber Security Training Program', w / 2, 110, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(180, 190, 210)
  doc.text('Cybersecurity Fundamentals · Threat Intelligence · Hands-on Labs', w / 2, 120, { align: 'center' })
  doc.text(`${ICT_SESSION.displayDates} · ${ICT_SESSION.allocatedHours} hours · Hands-on & Mentor-led`, w / 2, 128, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`Date: ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, w / 2, 140, { align: 'center' })

  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text(TRAINER.name, w / 2 - 55, 158, { align: 'center' })
  doc.setFontSize(9)
  doc.setTextColor(180, 190, 210)
  doc.text(`${TRAINER.title}`, w / 2 - 55, 164, { align: 'center' })
  doc.text(`${TRAINER.vendor} · ${TRAINER.email}`, w / 2 - 55, 170, { align: 'center' })

  doc.setFontSize(9)
  doc.text('CyberSec Arena · ICT Academy Training Platform', w / 2 + 55, 164, { align: 'center' })
  doc.text('Learn · Explore · Defend', w / 2 + 55, 170, { align: 'center' })

  doc.save(`ICT-CyberSec-Certificate-${username}.pdf`)
}
