import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@driftwatch.dev' },
    update: {},
    create: {
      email: 'demo@driftwatch.dev',
      name: 'Demo User',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created user:', user.email);

  // Create demo organization
  const org = await prisma.org.upsert({
    where: { id: 'demo-org-1' },
    update: {},
    create: {
      id: 'demo-org-1',
      name: 'Demo Organization',
    },
  });

  console.log('✅ Created organization:', org.name);

  // Add user as org owner
  const orgMember = await prisma.orgMember.upsert({
    where: {
      orgId_userId: {
        orgId: org.id,
        userId: user.id,
      }
    },
    update: {},
    create: {
      orgId: org.id,
      userId: user.id,
      role: 'owner',
    },
  });

  console.log('✅ Added user to organization with role:', orgMember.role);

  // Create demo project
  const project = await prisma.project.upsert({
    where: { id: 'demo-project-1' },
    update: {},
    create: {
      id: 'demo-project-1',
      orgId: org.id,
      name: 'Example Website',
      domains: ['example.com', 'www.example.com'],
      verified: true,
    },
  });

  console.log('✅ Created project:', project.name);

  // Create demo run
  const run = await prisma.run.create({
    data: {
      projectId: project.id,
      status: 'completed',
      configJson: {
        url: 'https://example.com',
        depth: 1,
        viewport: 'desktop',
      },
      summaryJson: {
        overall: 'passed',
        flows: { passed: 5, failed: 0 },
        a11y: { violations: 2, warnings: 5 },
        performance: { score: 92, lcp: 1.8, cls: 0.05 },
        visual: { changesDetected: 0 },
      },
      finishedAt: new Date(),
    },
  });

  console.log('✅ Created demo run:', run.id);

  // Create demo baseline
  await prisma.baseline.create({
    data: {
      projectId: project.id,
      path: '/',
      imageUrl: '/baselines/homepage-baseline.png',
    },
  });

  console.log('✅ Created demo baseline');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });