const stringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const s2 = str2.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  if (s1 === s2) return 1.0;

  const tokens1 = s1.split(/\s+/).filter(t => t.length > 2);
  const tokens2 = s2.split(/\s+/).filter(t => t.length > 2);
  
  if (tokens1.length === 0 || tokens2.length === 0) {
    if (s1.includes(s2) || s2.includes(s1)) return 0.5;
    return 0;
  }
  
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) {
      intersection++;
    }
  }
  
  const union = set1.size + set2.size - intersection;
  return intersection / union;
};

export const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;
  const breakdown = {
    category: 0,
    title: 0,
    description: 0,
    brand: 0,
    color: 0,
    location: 0,
    date: 0,
    uniqueDetails: 0
  };
  const reason = [];

  // 1. Category (20%)
  if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    breakdown.category = 100;
    score += 20;
    reason.push("Same category");
  } else {
    breakdown.category = 0;
  }

  // 2. Title / Item Name (20%)
  const titleSim = stringSimilarity(lostItem.title, foundItem.title);
  breakdown.title = Math.round(titleSim * 100);
  score += (titleSim * 20);
  if (titleSim > 0.4) {
    reason.push("Similar item names");
  }

  // 3. Description (20%)
  const descSim = stringSimilarity(lostItem.description, foundItem.description);
  breakdown.description = Math.round(descSim * 100);
  score += (descSim * 20);
  if (descSim > 0.3) {
    reason.push("Similar item descriptions");
  }

  // 4. Brand (10%)
  let brandSim = 0;
  const b1 = (lostItem.brand || 'generic').toLowerCase().trim();
  const b2 = (foundItem.brand || 'generic').toLowerCase().trim();
  if (b1 === b2 && b1 !== 'generic' && b1 !== 'other') {
    brandSim = 1.0;
  } else if ((b1.includes(b2) || b2.includes(b1)) && b1 !== 'generic' && b1 !== 'other') {
    brandSim = 0.6;
  }
  breakdown.brand = Math.round(brandSim * 100);
  score += (brandSim * 10);
  if (brandSim > 0.5) {
    reason.push("Same brand");
  }

  // 5. Color (10%)
  let colorSim = 0;
  const c1 = (lostItem.color || '').toLowerCase().trim();
  const c2 = (foundItem.color || '').toLowerCase().trim();
  if (c1 === c2 && c1 !== '') {
    colorSim = 1.0;
  } else if (c1 !== '' && c2 !== '' && (c1.includes(c2) || c2.includes(c1))) {
    colorSim = 0.7;
  }
  breakdown.color = Math.round(colorSim * 100);
  score += (colorSim * 10);
  if (colorSim > 0.5) {
    reason.push("Same color");
  }

  // 6. Location (10%)
  let locSim = 0;
  const l1 = (lostItem.location || '').toLowerCase().trim();
  const l2 = (foundItem.location || '').toLowerCase().trim();
  if (l1 === l2 && l1 !== '') {
    locSim = 1.0;
  } else if (l1 !== '' && l2 !== '' && (l1.includes(l2) || l2.includes(l1))) {
    locSim = 0.7;
  } else if (l1 !== '' && l2 !== '') {
    const words1 = l1.split(/\s+/).filter(w => w.length > 3);
    const words2 = l2.split(/\s+/).filter(w => w.length > 3);
    const common = words1.filter(w => words2.includes(w));
    if (common.length > 0) {
      locSim = 0.5;
    }
  }
  breakdown.location = Math.round(locSim * 100);
  score += (locSim * 10);
  if (locSim > 0.4) {
    reason.push("Nearby or matching location");
  }

  // 7. Date Proximity (5%)
  let dateSim = 0;
  const d1 = new Date(lostItem.dateLost || lostItem.createdAt);
  const d2 = new Date(foundItem.dateFound || foundItem.createdAt);
  const diffTime = Math.abs(d1 - d2);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) {
    dateSim = 1.0;
  } else if (diffDays <= 3) {
    dateSim = 0.8;
  } else if (diffDays <= 7) {
    dateSim = 0.5;
  } else if (diffDays <= 14) {
    dateSim = 0.25;
  }
  breakdown.date = Math.round(dateSim * 100);
  score += (dateSim * 5);
  if (dateSim > 0.5) {
    reason.push("Reported around the same time");
  }

  // 8. Unique Details (5%)
  let uniqueSim = 0;
  const u1 = (lostItem.uniqueDetails || '').trim();
  const u2 = (foundItem.uniqueDetails || '').trim();
  if (u1 !== '' && u2 !== '') {
    uniqueSim = stringSimilarity(u1, u2);
  }
  breakdown.uniqueDetails = Math.round(uniqueSim * 100);
  score += (uniqueSim * 5);
  if (uniqueSim > 0.3) {
    reason.push("Matching unique details");
  }

  return {
    score: Math.min(Math.round(score), 100),
    breakdown,
    reason
  };
};

export const runMatchEngine = async (LostItem, FoundItem, Match, Notification) => {
  try {
    const lostItems = await LostItem.find({ status: 'active' });
    const foundItems = await FoundItem.find({ status: 'active' });
    
    let matchCount = 0;
    
    for (const lostItem of lostItems) {
      for (const foundItem of foundItems) {
        const calculation = calculateMatchScore(lostItem, foundItem);
        
        // Let's set a matching threshold (e.g. 50% score)
        if (calculation.score >= 50) {
          // Check if match already exists
          let existingMatch = await Match.findOne({
            lostItemId: lostItem._id,
            foundItemId: foundItem._id
          });
          
          if (existingMatch) {
            // Update score
            existingMatch.score = calculation.score;
            existingMatch.breakdown = calculation.breakdown;
            existingMatch.reason = calculation.reason;
            await existingMatch.save();
          } else {
            // Create new match
            const newMatch = new Match({
              lostItemId: lostItem._id,
              foundItemId: foundItem._id,
              score: calculation.score,
              breakdown: calculation.breakdown,
              reason: calculation.reason
            });
            await newMatch.save();
            matchCount++;
            
            // Notify both users
            // 1. Notify Lost Item Owner
            if (Notification) {
              await Notification.create({
                userId: lostItem.userId,
                title: 'Potential Match Found! 🌟',
                message: `We found a ${calculation.score}% match for your lost "${lostItem.title}".`,
                type: 'match',
                matchId: newMatch._id
              });
              
              // 2. Notify Found Item Owner
              await Notification.create({
                userId: foundItem.userId,
                title: 'Someone lost a similar item! 🔍',
                message: `Your found "${foundItem.title}" has a ${calculation.score}% match with a lost report.`,
                type: 'match',
                matchId: newMatch._id
              });
            }
          }
        }
      }
    }
    return matchCount;
  } catch (error) {
    console.error('Error in match engine execution:', error);
    return 0;
  }
};
