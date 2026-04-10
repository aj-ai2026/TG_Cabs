const fs = require('fs');
const glob = require('fs');

const files = [
    'c:/AJ-AI/TG-Cabs/index.html',
    'c:/AJ-AI/TG-Cabs/about.html',
    'c:/AJ-AI/TG-Cabs/services.html',
    'c:/AJ-AI/TG-Cabs/packages.html',
    'c:/AJ-AI/TG-Cabs/fleet.html',
    'c:/AJ-AI/TG-Cabs/contact.html',
    'c:/AJ-AI/TG-Cabs/booking.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // desktop nav replacement
    content = content.replace(
        '<li><a href="fleet.html">Fleet</a></li>\r\n        <li><a href="contact.html">Contact</a></li>', 
        '<li><a href="fleet.html">Fleet</a></li>\r\n        <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\r\n        <li><a href="contact.html">Contact</a></li>'
    );
     content = content.replace(
        '<li><a href="fleet.html">Fleet</a></li>\n        <li><a href="contact.html">Contact</a></li>', 
        '<li><a href="fleet.html">Fleet</a></li>\n        <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\n        <li><a href="contact.html">Contact</a></li>'
    );
    
    // desktop nav replacement when Active
    content = content.replace(
        '<li><a href="fleet.html" class="active">Fleet</a></li>\r\n        <li><a href="contact.html">Contact</a></li>', 
        '<li><a href="fleet.html" class="active">Fleet</a></li>\r\n        <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\r\n        <li><a href="contact.html">Contact</a></li>'
    );
    content = content.replace(
        '<li><a href="fleet.html" class="active">Fleet</a></li>\n        <li><a href="contact.html">Contact</a></li>', 
        '<li><a href="fleet.html" class="active">Fleet</a></li>\n        <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\n        <li><a href="contact.html">Contact</a></li>'
    );

    // mobile nav replacement multiline
    content = content.replace(
        '<a href="fleet.html">Our Fleet</a>\r\n    <a href="contact.html">Contact</a>',
        '<a href="fleet.html">Our Fleet</a>\r\n    <a href="hamara-hyderabad.html">Hamara Hyderabad</a>\r\n    <a href="contact.html">Contact</a>'
    );
    content = content.replace(
        '<a href="fleet.html">Our Fleet</a>\n    <a href="contact.html">Contact</a>',
        '<a href="fleet.html">Our Fleet</a>\n    <a href="hamara-hyderabad.html">Hamara Hyderabad</a>\n    <a href="contact.html">Contact</a>'
    );
    
    // mobile nav replacement single line
    content = content.replace(
        '<a href="fleet.html">Our Fleet</a><a href="contact.html">Contact</a>',
        '<a href="fleet.html">Our Fleet</a><a href="hamara-hyderabad.html">Hamara Hyderabad</a><a href="contact.html">Contact</a>'
    );

    // footer nav replacement
    content = content.replace(
        '<li><a href="fleet.html">Fleet</a></li>\r\n              <li><a href="booking.html">Book Now</a></li>',
        '<li><a href="fleet.html">Fleet</a></li>\r\n              <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\r\n              <li><a href="booking.html">Book Now</a></li>'
    );
    content = content.replace(
        '<li><a href="fleet.html">Fleet</a></li>\n              <li><a href="booking.html">Book Now</a></li>',
        '<li><a href="fleet.html">Fleet</a></li>\n              <li><a href="hamara-hyderabad.html">Hamara Hyderabad</a></li>\n              <li><a href="booking.html">Book Now</a></li>'
    );
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Successfully updated HTML files');
