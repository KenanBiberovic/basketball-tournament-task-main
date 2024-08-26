const fs = require("fs");
const groups = JSON.parse(fs.readFileSync("groups.json", "utf8"));

// Funkcija za simulaciju utakmice//
function simulateMatch(team1, team2) {
	const rankDifference = team1.FIBARanking - team2.FIBARanking;
	const randomFactor = Math.random();
	const score1 = Math.floor(70 + randomFactor * 30 + rankDifference);
	const score2 = Math.floor(70 + (1 - randomFactor) * 30 - rankDifference);

	return {
		winner: score1 > score2 ? team1.Team : team2.Team,
		score1: score1,
		score2: score2,
	};
}
//Simulacija utakmica u grupi
function simulateGroup(group) {
	const results = [];
	for (let i = 0; i < group.length; i++) {
		for (let j = i + 1; j < group.length; j++) {
			const match = simulateMatch(group[i], group[j]);
			results.push({
				team1: group[i].Team,
				team2: group[j].Team,
				score1: match.score1,
				score2: match.score2,
				winner: match.winner,
			});
		}
	}
	return results;
}
//Rangiranje timova u grupi
function rankTeams(group, results) {
	const standings = group.map((team) => ({
		team: team.Team,
		points: 0,
		scored: 0,
		conceded: 0,
		wins: 0,
		losses: 0,
	}));

	results.forEach((result) => {
		const team1 = standings.find((t) => t.team === result.team1);
		const team2 = standings.find((t) => t.team === result.team2);

		team1.scored += result.score1;
		team1.conceded += result.score2;
		team2.scored += result.score2;
		team2.conceded += result.score1;

		if (result.winner === team1.team) {
			team1.points += 2;
			team1.wins += 1;
			team2.points += 1;
			team2.losses += 1;
		} else {
			team2.points += 2;
			team2.wins += 1;
			team1.points += 1;
			team1.losses += 1;
		}
	});

	standings.sort((a, b) => b.points - a.points || b.scored - b.conceded - (a.scored - a.conceded));

	return standings;
}
//Prikaz rangiranja
function displayGroupResults(groupName, results, standings) {
	console.log(`Grupa ${groupName}:`);
	results.forEach((result) => {
		console.log(`${result.team1} - ${result.team2} (${result.score1}:${result.score2})`);
	});
	console.log(`Rangiranje:`);
	standings.forEach((team, index) => {
		console.log(`${index + 1}. ${team.team} - ${team.wins} pobeda, ${team.losses} poraza, ${team.points} bodova`);
	});
}
//Poziv za svaku grupu
Object.keys(groups).forEach((groupName) => {
	const group = groups[groupName];
	const results = simulateGroup(group);
	const standings = rankTeams(group, results);
	displayGroupResults(groupName, results, standings);
});
