/* ============================================
   console-message.js — DevTools ASCII Art
   ============================================ */
(function () {
    const art = `
%c███████╗ █████╗ ██╗   ██╗ █████╗ ███╗   ██╗██████╗ ███████╗███████╗██████╗
██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔══██╗██╔════╝██╔════╝██╔══██╗
███████╗███████║ ╚████╔╝ ███████║██╔██╗ ██║██║  ██║█████╗  █████╗  ██████╔╝
╚════██║██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║  ██║██╔══╝  ██╔══╝  ██╔═══╝
███████║██║  ██║   ██║   ██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║
╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝
    `;

    console.log(art, 'color: #00f0ff; font-family: monospace; font-size: 10px;');
    console.log(
        '%c🔍 Looking under the hood? I like your curiosity. Let\'s connect!\n' +
        '%c   GitHub: https://github.com/Sayan51\n' +
        '   Email: sayandeeppradhan606@gmail.com',
        'color: #b400ff; font-size: 14px; font-weight: bold;',
        'color: #00f0ff; font-size: 12px;'
    );
})();
