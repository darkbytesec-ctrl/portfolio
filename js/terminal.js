/**
 * Interactive Cyber Terminal Simulator
 * Parth Solanki Offensive Security Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-cmd-input');
    const historyContainer = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('interactive-terminal');

    if (!input || !historyContainer) return;

    // Command History tracking
    let commandHistory = [];
    let historyIndex = -1;

    // Available virtual files for 'cat' and 'ls'
    const virtualFiles = {
        'about.txt': `Parth Solanki | Offensive Security Researcher & Bug Bounty Hunter
Specialized in web application security, API testing, and red team engagements.
Passionate about uncovering complex business logic vulnerabilities and securing architectures.`,
        'skills.md': `# Core Disciplines
- Web & API Pentesting (OWASP Top 10, GraphQL, REST, OAuth)
- Logic Flaws & Race Conditions
- SSRF & Cloud Metadata Exploitation
- Attack Surface Management & Recon Automation`,
        'hall_of_fame.log': `[+] Google VRP - Responsible Disclosure
[+] Microsoft - High-impact Authentication Findings
[+] FinTech Entities - Concurrency & Payment Gateway Flaws
[+] HackerOne / Bugcrowd - Top Researcher Recognitions`,
        'flag.txt': `FLAG{p4rth_s0l4nk1_3l1t3_h4ck3r_2026}`,
        'pgp_key.asc': `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: https://parthsolanki.sec

mQGNBGNEyIEBDAC2n04j77W... [FINGERPRINT: 9A82 4B5F 1C73 8E90 D421]
-----END PGP PUBLIC KEY BLOCK-----`
    };

    // Command Handlers
    const commands = {
        help: () => `
<span class="accent-cyan">Available Console Commands:</span>
  <span class="accent-green">whoami</span>        - Display operator bio and specialization
  <span class="accent-green">skills</span>        - List security arsenal and technical capabilities
  <span class="accent-green">hof</span>           - Display Hall of Fame & recognized disclosures
  <span class="accent-green">research</span>      - Overview of key vulnerability case studies
  <span class="accent-green">ls</span>            - List files in current directory
  <span class="accent-green">cat &lt;file&gt;</span>    - Read virtual file content (e.g. cat about.txt)
  <span class="accent-green">pgp</span>           - Display PGP public key fingerprint
  <span class="accent-green">contact</span>       - Display contact endpoints & LinkedIn
  <span class="accent-green">status</span>        - Display current engagement availability
  <span class="accent-green">clear</span>         - Clear the console screen
  <span class="accent-green">banner</span>        - Redisplay terminal banner
  <span class="accent-green">sudo</span>          - Execute command with elevated privileges
`,
        whoami: () => `
<span class="accent-cyan">[OPERATOR PROFILE]</span>
Name:           Parth Solanki
Role:           Offensive Security Specialist // Red Teamer // Bug Hunter
Location:       India / Global Remote
Profile:        <a href="https://linkedin.com/in/parth-solanki-b3713a171" target="_blank" style="color:var(--accent-cyan);text-decoration:underline;">linkedin.com/in/parth-solanki-b3713a171</a>
Philosophy:     "Find the crack in the logic before the adversary exploits it."
`,
        skills: () => `
<span class="accent-cyan">[SECURITY ARSENAL]</span>
  [*] <strong style="color:#fff;">Web & APIs:</strong>     IDOR/BOLA, SSRF, Race Conditions, GraphQL, OAuth 2.0, SQLi, JWT
  [*] <strong style="color:#fff;">Red Teaming:</strong>    Attack Surface Mapping, Cloud Metadata Pivoting, AD Enumeration
  [*] <strong style="color:#fff;">Tooling:</strong>        Burp Suite Pro, Nuclei, Nmap, Wireshark, Postman, ffuf, sqlmap
  [*] <strong style="color:#fff;">Scripting:</strong>      Python, Bash, JavaScript, Go, SQL
`,
        hof: () => `
<span class="accent-cyan">[HALL OF FAME & DISCLOSURES]</span>
  [+] Google VRP                   - Validated external vulnerabilities
  [+] Microsoft                    - Security acknowledgment
  [+] Major FinTech Providers      - Critical concurrency & business logic flaws
  [+] HackerOne & Bugcrowd         - High-signal triaged reports
  [+] Government VDP Commendations - Responsible infrastructure disclosures
`,
        research: () => `
<span class="accent-cyan">[SELECT RESEARCH CASE STUDIES]</span>
  #0194 | Full Account Takeover via Broken OAuth 2.0 Redirection  [CRITICAL]
  #0241 | Blind BOLA/IDOR in GraphQL Financial Gateway            [CRITICAL]
  #0312 | Microsecond Race Condition in Digital Coupon Logic       [HIGH]
  #0388 | SSRF via Webhook Validator to Cloud Metadata API        [CRITICAL]
(Type 'cat flag.txt' for an easter egg)
`,
        ls: () => {
            const files = Object.keys(virtualFiles).map(f => {
                if (f.endsWith('.txt')) return `<span style="color:#38bdf8;">${f}</span>`;
                if (f.endsWith('.md')) return `<span style="color:#a855f7;">${f}</span>`;
                if (f.endsWith('.log')) return `<span style="color:#f59e0b;">${f}</span>`;
                if (f.endsWith('.asc')) return `<span style="color:#00ff88;">${f}</span>`;
                return f;
            }).join('   ');
            return files;
        },
        cat: (args) => {
            if (!args || args.length === 0) {
                return `<span style="color:#ff3366;">Usage: cat &lt;filename&gt; (try: cat about.txt, cat flag.txt)</span>`;
            }
            const filename = args[0].trim();
            if (virtualFiles[filename]) {
                return `<pre style="color:#cbd5e1;white-space:pre-wrap;margin:4px 0;">${escapeHtml(virtualFiles[filename])}</pre>`;
            } else {
                return `<span style="color:#ff3366;">cat: ${escapeHtml(filename)}: No such file or directory</span>`;
            }
        },
        pgp: () => `
<span class="accent-cyan">[PGP PUBLIC KEY FINGERPRINT]</span>
9A82 4B5F 1C73 8E90 D421 5683 2419 BCFE 8092 1A3E
Key ID: 0x80921A3E
Type: RSA 4096-bit (Encrypted communication verified)
`,
        contact: () => `
<span class="accent-cyan">[COMMUNICATION ENDPOINTS]</span>
LinkedIn:  <a href="https://linkedin.com/in/parth-solanki-b3713a171" target="_blank" style="color:var(--accent-cyan);text-decoration:underline;">linkedin.com/in/parth-solanki-b3713a171</a>
GitHub:    <a href="https://github.com/darkbytesec-ctrl" target="_blank" style="color:var(--accent-cyan);text-decoration:underline;">github.com/darkbytesec-ctrl</a>
X/Twitter: <a href="https://twitter.com" target="_blank" style="color:var(--accent-cyan);text-decoration:underline;">@parthsolanki_sec</a>
Form:      Scroll to bottom to send a direct message.
`,
        status: () => `
<span class="accent-green">● STATUS: ACTIVE</span>
Accepting private bug bounty invites, web/API penetration tests, and red team engagements.
`,
        sudo: () => `
<span style="color:#ff3366;">[!] ACCESS DENIED.</span>
visitor is not in the sudoers file. This security incident will be logged and reported to Parth Solanki.
`,
        banner: () => `
  _____            _   _       _____       _             _    _ 
 |  __ \\          | | | |     / ____|     | |           | |  (_)
 | |__) |_ _ _ __ | |_| |__  | (___   ___ | | __ _ _ __ | | ___ 
 |  ___/ _\` | '__|| __| '_ \\  \\___ \\ / _ \\| |/ _\` | '_ \\| |/ / |
 | |  | (_| | |   | |_| | | | ____) | (_) | | (_| | | | |   <| |
 |_|   \\__,_|_|    \\__|_| |_||_____/ \\___/|_|\\__,_|_| |_|_|\\_\\_|
 
 [*] Parth Solanki Cyber Terminal Console v2.4
`,
        clear: () => {
            historyContainer.innerHTML = '';
            return null;
        }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    // Process entered command
    function executeCommand(rawInput) {
        const trimmed = rawInput.trim();
        if (!trimmed) return;

        // Save to command history
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Render command line in history
        const lineElem = document.createElement('div');
        lineElem.className = 'term-cmd-log';
        lineElem.innerHTML = `
            <div>
                <span class="prompt-user">visitor@parth-sec</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-char">$</span>
                <span class="cmd-executed">${escapeHtml(trimmed)}</span>
            </div>
        `;

        let outputContent = '';
        if (commands[cmd]) {
            const result = commands[cmd](args);
            if (result !== null) {
                outputContent = `<div class="cmd-output">${result}</div>`;
            }
        } else {
            outputContent = `<div class="cmd-output" style="color:#ff3366;">bash: ${escapeHtml(cmd)}: command not found. Type '<span class="accent-cyan">help</span>' for available commands.</div>`;
        }

        if (outputContent) {
            lineElem.innerHTML += outputContent;
            historyContainer.appendChild(lineElem);
        }

        // Auto-scroll to bottom of terminal
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Key event listener for terminal input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value;
            input.value = '';
            executeCommand(val);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex] || '';
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const val = input.value.trim();
            if (!val) return;

            const available = Object.keys(commands);
            const matches = available.filter(c => c.startsWith(val.toLowerCase()));
            if (matches.length === 1) {
                input.value = matches[0] + ' ';
            }
        }
    });

    // Clicking anywhere in terminal focuses the input
    terminalBody.addEventListener('click', () => {
        input.focus();
    });
});
