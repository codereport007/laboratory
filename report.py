from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

def create_fever_report():
    filename = "Blood_Report_Nikhil_Fever_Case.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # --- Header ---
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, 750, "GENERAL PATHOLOGY & DIAGNOSTICS")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, 735, "ISO 9001:2015 Certified Lab | Hyderabad, Telangana")
    c.drawString(50, 720, "Phone: +91-40-12345678 | Email: reports@genpathlabs.in")
    
    # Draw Line
    c.setLineWidth(1)
    c.line(50, 710, 560, 710)

    # --- Patient Info ---
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 680, "Patient Details")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, 660, "Name: U. Nikhil")
    c.drawString(50, 645, "Age/Gender: 21 Y / Male")
    c.drawString(50, 630, "Ref ID: 8829-XJ-21")
    
    c.drawString(350, 660, "Date: November 26, 2025")
    c.drawString(350, 645, "Sample Type: Whole Blood (EDTA)")
    c.drawString(350, 630, "Referred By: Dr. S. Rao, MD") # Changed to a Doctor ref for realism in sickness

    # --- Section Title ---
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.darkblue)
    c.drawString(50, 590, "HEMATOLOGY REPORT (COMPLETE BLOOD COUNT)")
    c.setFillColor(colors.black)

    # --- Data for Table (Simulated Fever/Infection) ---
    data = [
        ["TEST NAME", "RESULT", "UNITS", "REFERENCE RANGE"],
        ["Hemoglobin (Hb)", "14.8", "g/dL", "13.0 - 17.0"],
        ["Total RBC Count", "4.9", "mill/cumm", "4.5 - 5.5"],
        ["Packed Cell Volume (PCV)", "43.0", "%", "40.0 - 50.0"],
        ["MCV", "87.0", "fL", "83.0 - 101.0"],
        ["MCH", "29.0", "pg", "27.0 - 32.0"],
        ["MCHC", "33.0", "g/dL", "31.5 - 34.5"],
        # WBC is High (Leukocytosis) - Indication of Infection
        ["Total WBC Count", "13,800", "cells/cumm", "4,000 - 11,000"],
        ["Platelet Count", "210,000", "cells/cumm", "150,000 - 450,000"],
    ]

    # --- Create Table ---
    table = Table(data, colWidths=[200, 80, 80, 150])
    
    # --- Style Table ---
    # We will manually highlight the High WBC row in red text in a real app, 
    # but here we use standard styling for simplicity.
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
        # Highlight WBC Row (Row index 7) text to Red to show abnormality
        ('TEXTCOLOR', (0, 7), (-1, 7), colors.red),
    ])
    table.setStyle(style)

    # Draw Table
    table.wrapOn(c, width, height)
    table.drawOn(c, 50, 380)

    # --- Differential Count Section ---
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 350, "DIFFERENTIAL LEUKOCYTE COUNT (DLC)")
    
    # Neutrophils increased (Neutrophilia) typical in bacterial fever
    dlc_data = [
        ["Neutrophils", "78 %", "40 - 70 (HIGH)"], 
        ["Lymphocytes", "18 %", "20 - 40 (LOW)"],
        ["Eosinophils", "2 %", "1 - 6"],
        ["Monocytes", "2 %", "2 - 10"],
        ["Basophils", "0 %", "0 - 1"],
    ]
    
    y_pos = 330
    c.setFont("Helvetica", 10)
    for row in dlc_data:
        c.drawString(50, y_pos, f"{row[0]}:")
        c.setFont("Helvetica-Bold", 10)
        
        # Highlight abnormal values in Red
        if "HIGH" in row[2] or "LOW" in row[2]:
            c.setFillColor(colors.red)
        else:
            c.setFillColor(colors.black)
            
        c.drawString(150, y_pos, row[1])
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 10)
        c.drawString(250, y_pos, f"(Normal: {row[2]})")
        y_pos -= 20

    # --- Footer / Remarks ---
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 200, "Pathologist Remarks:")
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.red)
    c.drawString(50, 185, "Picture suggests Leukocytosis with Neutrophilia.")
    c.drawString(50, 170, "Correlate clinically with history of fever/infection.")
    c.setFillColor(colors.black)

    # --- Disclaimer / Watermark ---
    c.saveState()
    c.setFont("Helvetica-Bold", 40)
    c.setFillColorRGB(0.9, 0.9, 0.9) 
    c.translate(300, 400)
    c.rotate(45)
    c.restoreState()

    c.setFont("Helvetica-Oblique", 8)
    c.drawCentredString(300, 30, "** Computer-generated simulation for testing purposes only **")

    c.save()
    print(f"PDF Generated successfully: {filename}")

if __name__ == "__main__":
    create_fever_report()