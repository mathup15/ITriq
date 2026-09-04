import { useState } from 'react'

const ARTICLES = [
  {
    id: 1, cat: 'Network', icon: '🌐',
    title: 'How to troubleshoot office WiFi',
    desc: 'Step-by-step guide to diagnose and fix common WiFi connectivity issues in the office.',
    steps: [
      'Check that WiFi is enabled on your device (look for the WiFi icon in the taskbar or menu bar).',
      'Forget the office WiFi network and reconnect — enter the password again when prompted.',
      'Restart your device and try connecting again.',
      'Move closer to the WiFi router or access point to rule out signal issues.',
      'Check if other devices can connect to the same network. If not, the issue may be with the router.',
      'Restart the WiFi router by unplugging it for 30 seconds and plugging it back in.',
      'If the problem persists, submit an IT support ticket with your device name and location.',
    ],
  },
  {
    id: 2, cat: 'Network', icon: '🌐',
    title: 'How to reconnect to VPN',
    desc: 'Fix VPN connection errors and reconnect to the company network from home or remote locations.',
    steps: [
      'Open the VPN client application on your device.',
      'Check that you are connected to the internet before attempting the VPN connection.',
      'Ensure you are using the correct server address provided by your IT team.',
      'Re-enter your credentials — your VPN password may have expired.',
      'Disable any other VPN or proxy software that may be conflicting.',
      'Restart the VPN client and try again.',
      'If you see Error 800, check your firewall settings or contact IT support.',
    ],
  },
  {
    id: 3, cat: 'Hardware', icon: '💻',
    title: 'What to do when your laptop is slow',
    desc: 'Common causes of slow laptop performance and how to resolve them quickly.',
    steps: [
      'Restart your laptop — this clears temporary files and refreshes system memory.',
      'Close unused applications and browser tabs to free up RAM.',
      'Check available disk space. If less than 10% is free, delete unnecessary files.',
      'Run a virus/malware scan using your company antivirus software.',
      'Disable startup programs: open Task Manager → Startup tab → disable non-essential apps.',
      'Check for pending Windows or macOS updates and install them.',
      'If the laptop is overheating, clean the vents and use it on a hard flat surface.',
      'If none of the above helps, submit an IT ticket for a hardware inspection.',
    ],
  },
  {
    id: 4, cat: 'Hardware', icon: '💻',
    title: 'Printer not responding — quick fixes',
    desc: 'Resolve paper jam errors, offline printer status, and driver issues.',
    steps: [
      'Check that the printer is powered on and all cables are connected.',
      'Verify the printer is set as the default printer on your computer.',
      'Clear the print queue: open Devices and Printers → right-click the printer → See what\'s printing → cancel all jobs.',
      'For a paper jam error, open all printer trays and gently remove any stuck paper.',
      'Restart both the printer and your computer.',
      'Reinstall the printer driver from the manufacturer\'s website if the issue persists.',
      'Submit an IT ticket if the printer shows a hardware error code.',
    ],
  },
  {
    id: 5, cat: 'Account Access', icon: '🔐',
    title: 'How to reset your company password',
    desc: 'Step-by-step instructions to reset your corporate account password safely.',
    steps: [
      'Go to the company login page and click "Forgot Password".',
      'Enter your company email address and click Submit.',
      'Check your email inbox (and spam folder) for a password reset link.',
      'Click the link within 15 minutes — reset links expire quickly.',
      'Choose a strong password: at least 8 characters, including uppercase, numbers, and symbols.',
      'Do not reuse your previous password.',
      'If you do not receive the reset email, contact IT support directly.',
    ],
  },
  {
    id: 6, cat: 'Account Access', icon: '🔐',
    title: 'Locked out of your account?',
    desc: 'What to do when you are locked out after multiple failed login attempts.',
    steps: [
      'Wait 15 minutes — most systems automatically unlock after a short lockout period.',
      'Do not keep attempting to log in, as this may extend the lockout.',
      'Use the self-service password reset option if available.',
      'Contact your IT support team with your employee ID and email address.',
      'IT will verify your identity before unlocking the account.',
      'Once unlocked, immediately change your password to something secure.',
    ],
  },
  {
    id: 7, cat: 'Software', icon: '📦',
    title: 'Microsoft Office keeps crashing',
    desc: 'Fix crashes in Word, Excel, and Outlook caused by corrupted files or add-ins.',
    steps: [
      'Save your work frequently and restart the Office application.',
      'Open Office in Safe Mode: hold Ctrl while launching the app to disable add-ins.',
      'If it works in Safe Mode, disable add-ins one by one to find the culprit.',
      'Run Office Repair: Control Panel → Programs → Microsoft Office → Change → Quick Repair.',
      'Check for and install pending Office updates.',
      'Delete the temporary Office files in %AppData%\\Microsoft\\Office.',
      'If a specific file causes the crash, it may be corrupted — try opening a different file.',
      'Submit an IT ticket if the issue continues after these steps.',
    ],
  },
  {
    id: 8, cat: 'Software', icon: '📦',
    title: 'How to request software installation',
    desc: 'Submit a request for new software to be installed on your work device.',
    steps: [
      'Do not attempt to install software yourself — company devices require IT approval.',
      'Submit an IT support ticket with the software name and version you need.',
      'Include the business reason for the software request.',
      'IT will review the request and check for licensing and security compliance.',
      'Approved software will be installed remotely or during a scheduled visit.',
      'You will receive a notification once the installation is complete.',
    ],
  },
  {
    id: 9, cat: 'Security', icon: '🛡️',
    title: 'Received a suspicious email?',
    desc: 'How to identify phishing emails and what to do if you clicked a suspicious link.',
    steps: [
      'Do not click any links or download attachments from the suspicious email.',
      'Check the sender\'s email address carefully — phishing emails often use slight misspellings.',
      'Legitimate companies will never ask for your password via email.',
      'If you already clicked a link, disconnect from the internet immediately.',
      'Change your passwords from a different, safe device.',
      'Report the email to your IT security team by forwarding it as an attachment.',
      'Submit an IT security ticket immediately — mark it as Critical priority.',
    ],
  },
  {
    id: 10, cat: 'Security', icon: '🛡️',
    title: 'Suspicious login notification',
    desc: 'Steps to take immediately if you receive an unexpected login alert on your account.',
    steps: [
      'Do not ignore the notification — treat it as a real security incident.',
      'Immediately change your account password from a trusted device.',
      'Enable two-factor authentication (2FA) if not already active.',
      'Check your account\'s recent activity for any unauthorised actions.',
      'Log out of all active sessions from your account security settings.',
      'Notify your IT security team by submitting a Critical priority ticket.',
      'Do not share your new password with anyone, including IT staff.',
    ],
  },
]

const CATS = [
  { label: 'Network', icon: '🌐' },
  { label: 'Hardware', icon: '💻' },
  { label: 'Software', icon: '📦' },
  { label: 'Account Access', icon: '🔐' },
  { label: 'Security', icon: '🛡️' },
]

export default function HelpCenter() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCat === 'All' || a.cat === activeCat
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy to-slate text-white px-6 py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-2">How can we help?</h1>
        <p className="text-slate-300 text-sm mb-6">Browse troubleshooting guides for common IT issues.</p>
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search troubleshooting guides..."
            className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-ai text-sm"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeCat === 'All' ? 'bg-brand-blue text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-blue/40'}`}
          >
            All Topics
          </button>
          {CATS.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCat(c.label)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeCat === c.label ? 'bg-brand-blue text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-blue/40'}`}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-600 font-medium">No articles found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-brand-blue/40 transition-all cursor-pointer text-left w-full"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{a.icon}</span>
                  <div>
                    <p className="font-semibold text-navy text-sm mb-1">{a.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
                    <span className="inline-block mt-2 text-xs text-brand-blue font-medium">Read guide →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Sri Lanka note */}
        <div className="bg-blue-50 border border-brand-blue/20 rounded-xl p-5 flex gap-3">
          <span className="text-2xl">🇱🇰</span>
          <div>
            <p className="font-semibold text-navy text-sm">Built for Sri Lankan organisations</p>
            <p className="text-slate-500 text-xs mt-1">
              ITriq helps schools, hospitals, government offices, and businesses across Sri Lanka replace informal WhatsApp IT requests with a structured, AI-assisted support system.
            </p>
          </div>
        </div>
      </div>

      {/* Article modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selected.icon}</span>
                <div>
                  <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">{selected.cat}</span>
                  <h2 className="text-base font-bold text-navy mt-0.5">{selected.title}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 mt-0.5"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-5 flex-1">
              <p className="text-sm text-slate-500 mb-5">{selected.desc}</p>
              <ol className="space-y-3">
                {selected.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-xs text-amber-700 font-medium">
                  💡 Still having issues? Submit an IT support ticket and our team will help you.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setSelected(null)}
                className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
