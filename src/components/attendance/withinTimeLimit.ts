//---

function isWithinTimeLimit(targetTime: string): boolean {
    if (targetTime.length == 0)
        return false
    // Parse the target time
    const [hours, minutes, seconds] = targetTime.split(':').map(Number);
    const target = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
    target.setHours(hours, minutes, seconds);
    console.log(`target----------------------------------> ${target}`)

    // Get current time in EAT
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
    console.log(`Now----------------------------------> ${now}`)

    // Calculate time difference in milliseconds
    const diff = Math.abs(now.getTime() - target.getTime());
    console.log(`diff----------------------------------> ${diff}`)
    
    // Check if difference is less than or equal to 1 minute (60000 milliseconds)
    return diff <= 60000 * 5;
}

export default isWithinTimeLimit