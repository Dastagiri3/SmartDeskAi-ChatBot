export interface AIResponse {
  resolution: string;
  confidence: 'High' | 'Medium' | 'Low';
}

const mockResponses: Record<string, AIResponse[]> = {
  Network: [
    {
      resolution: `**Step 1:** Check if your network cable is securely connected to your computer and router/switch.

**Step 2:** Restart your router by unplugging it for 30 seconds, then plugging it back in.

**Step 3:** Open Command Prompt (Windows) or Terminal (Mac) and run:
- Windows: \`ipconfig /release\` then \`ipconfig /renew\`
- Mac: Go to System Preferences > Network > Advanced > TCP/IP > Renew DHCP Lease

**Step 4:** Verify your network adapter is enabled:
- Windows: Control Panel > Network and Sharing Center > Change adapter settings
- Mac: System Preferences > Network

**Step 5:** If the issue persists, try connecting to a different network port or use WiFi temporarily to isolate the problem.

If none of these steps resolve your issue, please escalate to Level 2 support for further investigation.`,
      confidence: 'High',
    },
    {
      resolution: `**WiFi Connection Troubleshooting:**

**Step 1:** Toggle WiFi off and on again on your device.

**Step 2:** Forget the network and reconnect:
- Go to WiFi settings
- Select your network
- Choose "Forget" or "Remove"
- Search for the network again and reconnect with the password

**Step 3:** Check if other devices can connect to the same network. If they cannot, the issue is with your router.

**Step 4:** Move closer to the router to rule out signal strength issues.

**Step 5:** Update your WiFi adapter drivers:
- Windows: Device Manager > Network adapters > Right-click your WiFi adapter > Update driver
- Mac: Check for system updates in System Preferences

If the problem continues, contact your network administrator or ISP.`,
      confidence: 'High',
    },
  ],
  Software: [
    {
      resolution: `**Application Not Responding Fix:**

**Step 1:** Force quit the application:
- Windows: Press Ctrl+Alt+Delete > Task Manager > End Task
- Mac: Press Cmd+Option+Esc > Select the app > Force Quit

**Step 2:** Restart your computer to clear any memory issues.

**Step 3:** Check for application updates:
- Open the application's settings or help menu
- Look for "Check for Updates" option

**Step 4:** Clear application cache/temporary files:
- Windows: %temp% folder or application's AppData folder
- Mac: ~/Library/Caches

**Step 5:** If the issue persists, try reinstalling the application:
- Uninstall completely
- Restart computer
- Download latest version from official source
- Reinstall

Document any error messages you see for escalation if needed.`,
      confidence: 'High',
    },
    {
      resolution: `**Software Installation Issues:**

**Step 1:** Verify system requirements:
- Check the software's minimum RAM, CPU, and OS version requirements
- Ensure you have sufficient disk space (at least 2GB free)

**Step 2:** Run the installer as Administrator:
- Right-click the installer file
- Select "Run as Administrator"

**Step 3:** Temporarily disable antivirus software:
- Some security software blocks installations
- Re-enable immediately after installation

**Step 4:** Check for Windows/Mac updates:
- Install all pending system updates
- Restart your computer

**Step 5:** Download a fresh copy of the installer:
- Previous download may be corrupted
- Download directly from vendor's official website

If installation still fails, capture the error code and escalate to IT support.`,
      confidence: 'Medium',
    },
  ],
  Hardware: [
    {
      resolution: `**Hardware Diagnostic Steps:**

**Step 1:** Perform a visual inspection:
- Check all cables are properly connected
- Look for any physical damage or loose connections
- Ensure power cables are securely plugged in

**Step 2:** Restart the device:
- Power off completely
- Wait 30 seconds
- Power back on

**Step 3:** Check device drivers:
- Windows: Device Manager > Look for yellow warning icons
- Mac: System Information > Hardware

**Step 4:** Test with alternative cables/ports:
- Try different USB ports
- Use a different cable if available
- Test on another computer if possible

**Step 5:** Run hardware diagnostics:
- Windows: Type "Windows Memory Diagnostic" in search
- Mac: Hold D key during boot for Apple Diagnostics

If hardware shows physical damage or diagnostics fail, request a replacement or repair through IT asset management.`,
      confidence: 'Medium',
    },
  ],
  Access: [
    {
      resolution: `**Account Access & Password Issues:**

**Step 1:** Verify username spelling and format:
- Check if username should include @company.com
- Verify there are no extra spaces
- Ensure Caps Lock is OFF

**Step 2:** Reset your password:
- Go to the login page
- Click "Forgot Password"
- Follow email instructions to reset
- Use a strong password (8+ characters, mix of letters, numbers, symbols)

**Step 3:** Clear browser cache and cookies:
- This resolves many login issues
- Try logging in using an incognito/private window

**Step 4:** Try a different browser:
- Some applications work better in specific browsers
- Update your browser to the latest version

**Step 5:** Verify account status:
- Contact your manager to confirm your account is active
- Check if your access needs to be renewed

If you still cannot log in after password reset, your account may be locked. Contact IT support immediately.`,
      confidence: 'High',
    },
    {
      resolution: `**VPN & Remote Access Issues:**

**Step 1:** Verify VPN credentials:
- Ensure you're using the correct VPN address
- Check your username and password
- Some VPNs require MFA/2FA codes

**Step 2:** Update VPN client software:
- Download the latest version from IT portal
- Uninstall old version first
- Restart computer after installation

**Step 3:** Check internet connection:
- Ensure you have stable internet
- Try connecting without VPN first
- Disable any proxy settings

**Step 4:** Firewall and antivirus check:
- Temporarily disable firewall to test
- Add VPN client to antivirus exceptions
- Re-enable firewall after testing

**Step 5:** Try connecting from a different network:
- Use mobile hotspot to rule out network blocks
- Some networks block VPN ports

If VPN still fails, request IT support to check your VPN account status and permissions.`,
      confidence: 'Medium',
    },
  ],
  Other: [
    {
      resolution: `**General IT Issue Troubleshooting:**

**Step 1:** Restart your device:
- This resolves 80% of common IT issues
- Perform a full shutdown, not just sleep mode

**Step 2:** Document the issue:
- Note exactly when the problem started
- Write down any error messages
- List what you were doing when it occurred

**Step 3:** Check for updates:
- Operating system updates
- Application updates
- Driver updates

**Step 4:** Search knowledge base:
- Visit company IT portal
- Search for your specific error message
- Review similar resolved tickets

**Step 5:** Gather information for escalation:
- Computer name and model
- Operating system version
- Screenshots of errors
- Steps to reproduce the issue

If you cannot resolve the issue, please escalate with all the information gathered above for faster resolution.`,
      confidence: 'Low',
    },
  ],
};

export const getAIResolution = async (
  category: string,
  description: string
): Promise<AIResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const categoryResponses = mockResponses[category] || mockResponses.Other;
  const randomResponse =
    categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

  return randomResponse;
};

export const simulateTranslation = async (
  text: string,
  targetLang: 'en' | 'ja'
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (targetLang === 'ja') {
    return `[日本語訳] ${text}`;
  }

  return `[English translation] ${text}`;
};
