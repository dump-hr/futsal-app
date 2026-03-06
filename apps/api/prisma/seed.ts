import { Group, MatchType, EventType } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

async function main() {
  await prisma.matchEvent.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournament.deleteMany();

  const tournament = await prisma.tournament.create({
    data: { name: 'DUMP Futsal 2026' },
  });

  const teamsData = [
    { name: 'FESB United', group: Group.A },
    { name: 'PMF Strikers', group: Group.A },
    { name: 'Ekonomski FC', group: Group.B },
    { name: 'Pravni Lions', group: Group.B },
    { name: 'KTF Rockets', group: Group.C },
    { name: 'Kineziologija XI', group: Group.C },
    { name: 'Medicinski Wolves', group: Group.D },
    { name: 'Građevinski Titans', group: Group.D },
  ];

  const teams = await Promise.all(
    teamsData.map((t) =>
      prisma.team.create({
        data: {
          name: t.name,
          group: t.group,
          tournamentId: tournament.id,
        },
      }),
    ),
  );

  const playerNames = [
    ['Ivan', 'Horvat'],
    ['Marko', 'Kovačević'],
    ['Luka', 'Babić'],
    ['Ante', 'Jurić'],
    ['Petar', 'Perić'],
    ['Matej', 'Knežević'],
    ['Josip', 'Marić'],
    ['Nikola', 'Novak'],
    ['Tomislav', 'Pavlović'],
    ['Filip', 'Kovač'],
    ['Dino', 'Vuković'],
    ['Borna', 'Radić'],
    ['Leon', 'Tomić'],
    ['Fran', 'Šarić'],
    ['Roko', 'Blažević'],
    ['Bruno', 'Grgić'],
    ['Tin', 'Matić'],
    ['Lovro', 'Petrović'],
    ['Jure', 'Bošnjak'],
    ['Domagoj', 'Mandić'],
    ['Karlo', 'Vidović'],
    ['Marin', 'Zelić'],
    ['Antonio', 'Galić'],
    ['David', 'Tadić'],
    ['Niko', 'Božić'],
    ['Stipe', 'Raguž'],
    ['Vito', 'Bilić'],
    ['Patrik', 'Krolo'],
    ['Sandro', 'Čolak'],
    ['Mihael', 'Vrdoljak'],
    ['Emil', 'Lončar'],
    ['Adrian', 'Stipić'],
    ['Jan', 'Klarin'],
    ['Robert', 'Barišić'],
    ['Denis', 'Zubčić'],
    ['Viktor', 'Puljiz'],
    ['Zvonimir', 'Hrstić'],
    ['Bernard', 'Šimić'],
    ['Goran', 'Lovrić'],
    ['Toni', 'Kulić'],
  ];

  const players: Array<{ id: number; teamId: number }> = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < 5; j++) {
      const nameIndex = i * 5 + j;
      const player = await prisma.player.create({
        data: {
          firstName: playerNames[nameIndex][0],
          lastName: playerNames[nameIndex][1],
          dateOfBirth: new Date(
            1998 + Math.floor(Math.random() * 6),
            Math.floor(Math.random() * 12),
            1 + Math.floor(Math.random() * 28),
          ),
          teamId: teams[i].id,
        },
      });
      players.push({ id: player.id, teamId: teams[i].id });
    }
  }

  const getTeamPlayers = (teamId: number) =>
    players.filter((p) => p.teamId === teamId);

  const randomPlayer = (teamId: number) => {
    const teamPlayers = getTeamPlayers(teamId);
    return teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
  };

  const groupPairs: Array<[number, number]> = [
    [0, 1], // Group A
    [2, 3], // Group B
    [4, 5], // Group C
    [6, 7], // Group D
  ];

  const baseDate = new Date('2026-03-15T18:00:00');

  for (let i = 0; i < groupPairs.length; i++) {
    const [homeIdx, awayIdx] = groupPairs[i];
    const homeTeam = teams[homeIdx];
    const awayTeam = teams[awayIdx];

    const homeGoals = Math.floor(Math.random() * 4);
    const awayGoals = Math.floor(Math.random() * 4);

    const matchTime = new Date(baseDate);
    matchTime.setHours(matchTime.getHours() + i * 2);

    const match = await prisma.match.create({
      data: {
        timeOfMatch: matchTime,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeGoals,
        awayGoals,
        matchType: MatchType.group,
      },
    });

    for (let g = 0; g < homeGoals; g++) {
      const scorer = randomPlayer(homeTeam.id);
      await prisma.matchEvent.create({
        data: {
          minute: 1 + Math.floor(Math.random() * 40),
          matchId: match.id,
          playerId: scorer.id,
          eventType: EventType.goal,
          isForHomeTeam: true,
        },
      });
    }

    for (let g = 0; g < awayGoals; g++) {
      const scorer = randomPlayer(awayTeam.id);
      await prisma.matchEvent.create({
        data: {
          minute: 1 + Math.floor(Math.random() * 40),
          matchId: match.id,
          playerId: scorer.id,
          eventType: EventType.goal,
          isForHomeTeam: false,
        },
      });
    }

    if (Math.random() > 0.4) {
      const cardTeam = Math.random() > 0.5 ? homeTeam : awayTeam;
      const cardPlayer = randomPlayer(cardTeam.id);
      await prisma.matchEvent.create({
        data: {
          minute: 1 + Math.floor(Math.random() * 40),
          matchId: match.id,
          playerId: cardPlayer.id,
          eventType: EventType.yellowCard,
          isForHomeTeam: cardTeam.id === homeTeam.id,
        },
      });
    }
  }

  const semi = await prisma.match.create({
    data: {
      timeOfMatch: new Date('2026-03-16T18:00:00'),
      homeTeamId: teams[0].id,
      awayTeamId: teams[2].id,
      homeGoals: 3,
      awayGoals: 1,
      matchType: MatchType.semiFinal,
    },
  });

  for (let g = 0; g < 3; g++) {
    const scorer = randomPlayer(teams[0].id);
    await prisma.matchEvent.create({
      data: {
        minute: [8, 22, 35][g],
        matchId: semi.id,
        playerId: scorer.id,
        eventType: EventType.goal,
        isForHomeTeam: true,
      },
    });
  }

  const awaySemiScorer = randomPlayer(teams[2].id);
  await prisma.matchEvent.create({
    data: {
      minute: 15,
      matchId: semi.id,
      playerId: awaySemiScorer.id,
      eventType: EventType.goal,
      isForHomeTeam: false,
    },
  });

  await prisma.match.create({
    data: {
      timeOfMatch: new Date('2026-03-17T20:00:00'),
      homeTeamId: teams[0].id,
      awayTeamId: teams[4].id,
      homeGoals: 0,
      awayGoals: 0,
      matchType: MatchType.final,
    },
  });

  console.log('Seed complete!');
  console.log(`  Tournament: ${tournament.name}`);
  console.log(`  Teams: ${teams.length}`);
  console.log(`  Players: ${players.length}`);
  console.log(`  Matches: 6 (4 group + 1 semi + 1 final)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
