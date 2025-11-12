#!/usr/bin/env python3
"""
Generador de Informe Técnico Profesional para ISP
Crea un PDF atractivo con encabezados, pies de página, colores e iconos
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Line
from reportlab.lib.utils import ImageReader
import os
from datetime import datetime

class PDFGenerator:
    def __init__(self, filename):
        self.filename = filename
        self.doc = SimpleDocTemplate(
            filename,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        self.story = []
        self.styles = self._create_styles()
        
    def _create_styles(self):
        styles = getSampleStyleSheet()
        
        # Estilo para título principal
        styles.add(ParagraphStyle(
            name='MainTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        # Estilo para subtítulos
        styles.add(ParagraphStyle(
            name='SubTitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#34495E'),
            spaceAfter=12,
            spaceBefore=20
        ))
        
        # Estilo para secciones
        styles.add(ParagraphStyle(
            name='Section',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1A5276'),
            spaceAfter=10,
            spaceBefore=15,
            borderPadding=5,
            backColor=colors.HexColor('#EBF5FB')
        ))
        
        # Estilo para párrafos normales
        styles.add(ParagraphStyle(
            name='BodyText',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=8,
            alignment=TA_JUSTIFY
        ))
        
        # Estilo para destacados
        styles.add(ParagraphStyle(
            name='Highlight',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#C0392B'),
            backColor=colors.HexColor('#FDEDEC'),
            borderPadding=8,
            spaceAfter=8
        ))
        
        # Estilo para citas
        styles.add(ParagraphStyle(
            name='Quote',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#566573'),
            leftIndent=20,
            rightIndent=20,
            spaceAfter=10,
            borderLeft=2,
            borderLeftColor=colors.HexColor('#5499C7'),
            borderPadding=5
        ))
        
        return styles
    
    def create_header_footer(self, canvas, doc):
        # Guardar estado del canvas
        canvas.saveState()
        
        # Encabezado
        canvas.setFillColor(colors.HexColor('#2C3E50'))
        canvas.rect(0, doc.pagesize[1] - 1*cm, doc.pagesize[0], 1*cm, fill=1, stroke=0)
        
        canvas.setFillColor(colors.white)
        canvas.setFont('Helvetica-Bold', 10)
        canvas.drawString(2*cm, doc.pagesize[1] - 0.7*cm, "INFORME TÉCNICO - SISTEMA DE GESTIÓN PARA ISP")
        
        canvas.setFillColor(colors.HexColor('#7F8C8D'))
        canvas.setFont('Helvetica', 8)
        canvas.drawRightString(doc.pagesize[0] - 2*cm, doc.pagesize[1] - 0.7*cm, f"Página {doc.page}")
        
        # Pie de página
        canvas.setFillColor(colors.HexColor('#34495E'))
        canvas.rect(0, 0, doc.pagesize[0], 1*cm, fill=1, stroke=0)
        
        canvas.setFillColor(colors.white)
        canvas.setFont('Helvetica', 8)
        canvas.drawString(2*cm, 0.7*cm, "Confidencial - Uso Exclusivo para Telecable")
        canvas.drawRightString(doc.pagesize[0] - 2*cm, 0.7*cm, f"Generado: {datetime.now().strftime('%d/%m/%Y')}")
        
        # Línea decorativa
        canvas.setStrokeColor(colors.HexColor('#5499C7'))
        canvas.setLineWidth(1)
        canvas.line(2*cm, doc.pagesize[1] - 1.2*cm, doc.pagesize[0] - 2*cm, doc.pagesize[1] - 1.2*cm)
        
        canvas.restoreState()
    
    def add_title_page(self):
        """Página de título principal"""
        title_style = self.styles['MainTitle']
        normal_style = self.styles['BodyText']
        
        # Espacio inicial
        self.story.append(Spacer(1, 3*cm))
        
        # Título principal
        title = Paragraph("INFORME TÉCNICO Y<br/>RECOMENDACIÓN ESTRATÉGICA", title_style)
        self.story.append(title)
        
        self.story.append(Spacer(1, 2*cm))
        
        # Información del proyecto
        project_info = [
            ["<b>PROYECTO:</b>", "Sistema de Gestión para ISP (10,000 - 15,000 Usuarios)"],
            ["<b>PREPARADO PARA:</b>", "Cliente (Telecable)"],
            ["<b>FECHA:</b>", datetime.now().strftime('%d de %B de %Y')],
            ["<b>BASADO EN:</b>", "Simulación Matemática Avanzada V3.0 y Análisis de Hardware"]
        ]
        
        project_table = Table(project_info, colWidths=[2.5*cm, 12*cm])
        project_table.setStyle(TableStyle([
            ('FONT', (0, 0), (-1, -1), 'Helvetica', 10),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        self.story.append(project_table)
        
        self.story.append(Spacer(1, 3*cm))
        
        # Nota importante
        note = Paragraph(
            "<i>Documento confidencial que contiene análisis técnico detallado y recomendaciones "
            "estratégicas para la implementación del sistema de gestión.</i>",
            self.styles['Quote']
        )
        self.story.append(note)
        
        self.story.append(PageBreak())
    
    def create_status_table(self):
        """Crear tabla de estados de arquitecturas"""
        # Encabezados de la tabla
        headers = ['Arquitectura', 'Escenario 1:<br/>"Tal Cual"<br/>(16GB RAM + 💿 HDD)', 
                  'Escenario 2:<br/>"Mínimo"<br/>(16GB RAM + ⚡ SSD)', 
                  'Escenario 3:<br/>"Recomendado"<br/>(32GB RAM + ⚡ SSD)']
        
        # Datos de la tabla
        data = [
            ['<b>Original (Microservicios Completos)</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🔴 <b>NO RECOMENDADO</b>'],
            
            ['<b>🏆 HÍBRIDA GO (GANADORA)</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🟡 <b>SE PUEDE TRABAJAR</b>', 
             '🟢 <b>MUY RECOMENDADO</b>'],
            
            ['<b>Monolito Go (Eficiente)</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🟢 <b>SE PUEDE TRABAJAR</b>', 
             '🟢 <b>MUY RECOMENDADO</b>'],
            
            ['<b>Microservicios Rust</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🟢 <b>SE PUEDE TRABAJAR</b>'],
            
            ['<b>Monolito PHP</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🟡 <b>SE PUEDE TRABAJAR</b>', 
             '🟢 <b>SE PUEDE TRABAJAR</b>'],
            
            ['<b>Monolito Python</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🟡 <b>SE PUEDE TRABAJAR</b>', 
             '🟢 <b>SE PUEDE TRABAJAR</b>'],
            
            ['<b>Microservicios Ligeros</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🔴 <b>NO RECOMENDADO</b>', 
             '🟢 <b>SE PUEDE TRABAJAR</b>']
        ]
        
        # Crear tabla
        table = Table([headers] + data, colWidths=[4.5*cm, 3.5*cm, 3.5*cm, 4*cm])
        
        # Estilos de la tabla
        table.setStyle(TableStyle([
            # Estilo de encabezados
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 9),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
            
            # Bordes de la tabla
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            
            # Estilo de filas
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 8),
            ('VALIGN', (0, 1), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            
            # Colores de fondo para filas
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#E8F6F3')),  # Ganadora
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FEF9E7')),  # Original
            ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#F4ECF7')),  # Rust
            
            # Altura de filas
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8F9F9')]),
            ('LINEABOVE', (0, 1), (-1, 1), 1, colors.HexColor('#7F8C8D')),
        ]))
        
        return table
    
    def add_architecture_analysis(self):
        """Análisis detallado de arquitecturas"""
        # Título de sección
        title = Paragraph("1. Resumen Visual: Arquitecturas vs. Escenarios", self.styles['SubTitle'])
        self.story.append(title)
        
        intro = Paragraph(
            "Para empezar, le presentamos un resumen visual del rendimiento de cada posible arquitectura. "
            "Hemos analizado qué sucede en tres escenarios de hardware distintos para que pueda tomar una "
            "decisión informada.",
            self.styles['BodyText']
        )
        self.story.append(intro)
        self.story.append(Spacer(1, 0.3*cm))
        
        # Tabla de estados
        self.story.append(self.create_status_table())
        self.story.append(Spacer(1, 0.5*cm))
        
        # Continuar con el resto del contenido...
        # [Aquí irían las demás secciones del informe]
        
    def generate_pdf(self):
        """Generar el PDF completo"""
        try:
            # Página de título
            self.add_title_page()
            
            # Resumen ejecutivo
            self.add_executive_summary()
            
            # Tabla de arquitecturas
            self.add_architecture_analysis()
            
            # Construir PDF con encabezado y pie de página
            self.doc.build(
                self.story,
                onFirstPage=self.create_header_footer,
                onLaterPages=self.create_header_footer
            )
            
            print(f"✅ PDF generado exitosamente: {self.filename}")
            return True
            
        except Exception as e:
            print(f"❌ Error al generar PDF: {str(e)}")
            return False

    def add_executive_summary(self):
        """Añadir resumen ejecutivo"""
        title = Paragraph("RESUMEN EJECUTIVO", self.styles['SubTitle'])
        self.story.append(title)
        
        summary = Paragraph(
            "Este informe presenta un análisis técnico exhaustivo de las diferentes arquitecturas "
            "de software evaluadas para el sistema de gestión de ISP. Basándonos en simulaciones "
            "matemáticas avanzadas y análisis de hardware, hemos identificado la solución óptima "
            "que garantiza rendimiento, estabilidad y escalabilidad para su operación.",
            self.styles['BodyText']
        )
        self.story.append(summary)
        
        self.story.append(Spacer(1, 0.5*cm))
        
        # Puntos clave
        key_points = [
            "🔍 <b>Análisis de 7 arquitecturas diferentes</b>",
            "⚡ <b>Evaluación en 3 escenarios de hardware</b>", 
            "🏆 <b>Arquitectura Híbrida Go identificada como óptima</b>",
            "💡 <b>Recomendaciones específicas de hardware</b>",
            "📊 <b>Simulación matemática V3.0 aplicada</b>"
        ]
        
        for point in key_points:
            p = Paragraph(point, self.styles['BodyText'])
            self.story.append(p)
            self.story.append(Spacer(1, 0.2*cm))

def main():
    """Función principal"""
    print("🚀 Generando Informe Técnico Profesional...")
    
    # Nombre del archivo con timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"Informe_Tecnico_ISP_{timestamp}.pdf"
    
    # Generar PDF
    generator = PDFGenerator(filename)
    success = generator.generate_pdf()
    
    if success:
        print(f"📄 El informe está listo: {filename}")
        print("✨ Puedes abrirlo y compartirlo con el cliente")
    else:
        print("❌ Error al generar el informe")

if __name__ == "__main__":
    main()