import os
import glob

html_files = glob.glob('c:/AJ-AI/TG-Cabs/*.html')

for file_path in html_files:
    if 'hamara-hyderabad.html' in file_path:
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace nav menu
    content = content.replace('<li><a href="fleet.html">Fleet</a></li>\n        <li><a href="contact.html">Contact</a></li>', 
                              '<li><a href="fleet.html">Fleet</a></li>\n        <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\n        <li><a href="contact.html">Contact</a></li>')
    content = content.replace('<li><a href="fleet.html" class="active">Fleet</a></li>\n        <li><a href="contact.html">Contact</a></li>', 
                              '<li><a href="fleet.html" class="active">Fleet</a></li>\n        <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\n        <li><a href="contact.html">Contact</a></li>')
                              
    # Replace mobile menu where they are on newlines
    content = content.replace('<a href="fleet.html">Our Fleet</a>\n    <a href="contact.html">Contact</a>',
                              '<a href="fleet.html">Our Fleet</a>\n    <a href="hamara-hyderabad.html">Hamara Hyderabad</a>\n    <a href="contact.html">Contact</a>')
                              
    # Replace mobile menu where they are on same line
    content = content.replace('<a href="fleet.html">Our Fleet</a><a href="contact.html">Contact</a>',
                              '<a href="fleet.html">Our Fleet</a><a href="hamara-hyderabad.html">Hamara Hyderabad</a><a href="contact.html">Contact</a>')
                              
    # Replace quick links in footer
    content = content.replace('<li><a href="fleet.html">Fleet</a></li>\n              <li><a href="booking.html">Book Now</a></li>',
                              '<li><a href="fleet.html">Fleet</a></li>\n              <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\n              <li><a href="booking.html">Book Now</a></li>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated all HTML files!")
