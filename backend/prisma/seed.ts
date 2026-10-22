import { PrismaClient, Difficulty, PoseCategory, ProgramCategory, SectionType, EventType, Role, EnrollmentStatus, RegistrationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting YogaLife database seeding...');

  // 1. Clear existing data in reverse dependency order
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.article.deleteMany();
  await prisma.practiceSession.deleteMany();
  await prisma.programEnrollment.deleteMany();
  await prisma.programPose.deleteMany();
  await prisma.yogaProgram.deleteMany();
  await prisma.yogaPose.deleteMany();
  await prisma.userGoal.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned old records.');

  // 2. Passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@yogalife.com',
      passwordHash: adminPasswordHash,
      name: 'Master Yogi Arya',
      role: Role.ADMIN,
      bio: 'E-RYT 500 Lead Yoga Acharya & Mindfulness Educator with 15+ years of traditional Hatha & Vinyasa teaching.',
      avatarUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@yogalife.com',
      passwordHash: userPasswordHash,
      name: 'Priya Sharma',
      role: Role.USER,
      bio: 'Lifelong learner on a journey toward mental clarity, flexibility, and daily mindfulness.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  // User Goals
  await prisma.userGoal.create({
    data: {
      userId: demoUser.id,
      dailyMinutesGoal: 20,
      weeklyDaysGoal: 5,
      targetExperienceLevel: Difficulty.BEGINNER,
      focusAreas: 'Flexibility, Core Strength, Stress Relief',
    },
  });

  console.log('Created Users & Goals.');

  // 4. Create Achievements
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        code: 'FIRST_STEP',
        title: 'First Step to Prana',
        description: 'Completed your very first guided yoga practice session.',
        badgeIcon: 'Sparkles',
        category: 'SESSIONS',
      },
      {
        code: 'STREAK_3',
        title: 'Three Days of Tranquility',
        description: 'Maintained a consistent 3-day practice streak.',
        badgeIcon: 'Flame',
        category: 'STREAK',
      },
      {
        code: 'STREAK_7',
        title: 'Weekly Zen Master',
        description: 'Completed practices for 7 consecutive days.',
        badgeIcon: 'Zap',
        category: 'STREAK',
      },
      {
        code: 'MIN_60',
        title: 'Hour of Harmony',
        description: 'Reached 60 cumulative minutes of mindful yoga practice.',
        badgeIcon: 'Clock',
        category: 'MINUTES',
      },
      {
        code: 'MIN_300',
        title: 'Prana Devotee',
        description: 'Dedicated 300 minutes toward conscious body-mind practice.',
        badgeIcon: 'Award',
        category: 'MINUTES',
      },
      {
        code: 'PROGRAM_COMPLETER',
        title: 'Path Unlocked',
        description: 'Enrolled in and completed a full yoga journey program.',
        badgeIcon: 'Compass',
        category: 'PROGRAMS',
      },
    ],
  });

  // Unlock first 2 achievements for demo user
  const firstStepAch = await prisma.achievement.findUnique({ where: { code: 'FIRST_STEP' } });
  const streakAch = await prisma.achievement.findUnique({ where: { code: 'STREAK_3' } });
  if (firstStepAch) {
    await prisma.userAchievement.create({
      data: { userId: demoUser.id, achievementId: firstStepAch.id },
    });
  }
  if (streakAch) {
    await prisma.userAchievement.create({
      data: { userId: demoUser.id, achievementId: streakAch.id },
    });
  }

  // 5. Seed 22 Yoga Poses
  const posesData = [
    {
      englishName: 'Mountain Pose',
      sanskritName: 'Tadasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.STANDING,
      targetedBodyAreas: 'Ankles, Thighs, Core, Spine, Posture',
      durationSeconds: 60,
      instructions: 'Stand tall with big toes touching and heels slightly apart. Ground through all four corners of your feet. Engage thighs and gently draw tailbone downward. Roll shoulders back and down, letting arms rest gently alongside the body with palms forward. Lengthen through the crown of your head.',
      breathingGuidance: 'Inhale deeply as you feel your spine elongate. Exhale grounding down through your feet with steady, rhythmic diaphragmatic breaths.',
      benefits: 'Improves posture, strengthens thighs and calves, relieves sciatica, fosters mental stillness and stability.',
      contraindications: 'Recent foot injury, severe headache, or dizziness.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Downward-Facing Dog',
      sanskritName: 'Adho Mukha Svanasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.INVERSION,
      targetedBodyAreas: 'Hamstrings, Calves, Shoulders, Back, Arms',
      durationSeconds: 60,
      instructions: 'Start on hands and knees with wrists under shoulders and knees under hips. Spread fingers wide. Tuck your toes, press firmly into your hands, and lift your knees toward the ceiling. Push hips high, lengthening the spine into an inverted V shape. Keep heels melting toward the mat.',
      breathingGuidance: 'Slow, steady ujjayi or nasal breathing. Exhale as you press chest gently toward thighs.',
      benefits: 'Calms the nervous system, energizes the body, strengthens wrists, arms and shoulders, lengthens hamstrings.',
      contraindications: 'Carpal tunnel syndrome, late pregnancy, severe high blood pressure.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Warrior I',
      sanskritName: 'Virabhadrasana I',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.STANDING,
      targetedBodyAreas: 'Quadriceps, Groin, Chest, Lungs, Shoulders',
      durationSeconds: 45,
      instructions: 'From standing, step right foot back about 3-4 feet. Turn back foot out 45 degrees. Bend left knee directly over left ankle at a 90-degree angle. Square your chest and hips forward. Sweep arms up overhead, palms facing each other, and soften shoulders away from ears.',
      breathingGuidance: 'Inhale to lift through fingertips and open chest; exhale to sink hips down into firm grounded strength.',
      benefits: 'Strengthens legs and ankles, builds stamina, opens hip flexors and chest, develops courage and focus.',
      contraindications: 'Recent knee surgery or unresolved hypertension (keep hands on hips).',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Warrior II',
      sanskritName: 'Virabhadrasana II',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.STANDING,
      targetedBodyAreas: 'Hips, Groin, Thighs, Shoulders, Chest',
      durationSeconds: 45,
      instructions: 'Stand wide across the mat. Turn right toes out 90 degrees and angle back toes slightly inwards. Extend arms parallel to the floor. Bend front right knee over ankle. Gaze calmly over right fingertips. Keep torso centered between hips.',
      breathingGuidance: 'Deep, expansive chest breathing. Exhale grounding through legs while maintaining light expansive arms.',
      benefits: 'Tones abdominal organs, strengthens legs and glutes, relieves backaches, stimulates digestion.',
      contraindications: 'Diarrhea, recent neck strain (keep head neutral facing side).',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Tree Pose',
      sanskritName: 'Vrksasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.BALANCING,
      targetedBodyAreas: 'Ankles, Calves, Thighs, Core, Pelvic Floor',
      durationSeconds: 45,
      instructions: 'Stand firmly on left leg. Shift weight into left foot. Place the sole of right foot either against the inner calf or upper inner thigh (avoid the knee joint). Find a focal point (drishti) at eye level. Bring palms together at heart center or raise arms high.',
      breathingGuidance: 'Smooth, unbroken breaths to anchor balance. Inhale reaching skyward, exhale feeling your root.',
      benefits: 'Improves balance and proprioception, strengthens tendons and ligaments of feet, enhances mental concentration.',
      contraindications: 'Severe vertigo or recent inner ear infection.',
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Child’s Pose',
      sanskritName: 'Balasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.RESTORATIVE,
      targetedBodyAreas: 'Spine, Hips, Thighs, Ankles, Nervous System',
      durationSeconds: 90,
      instructions: 'Kneel on floor with big toes touching. Widen knees mat-width apart. Sit hips back onto heels. Fold forward between thighs, resting forehead gently on the mat. Extend arms forward or rest them alongside legs with palms up. Completely release tension.',
      breathingGuidance: 'Breathe into the back of your lungs and ribcage. Feel the belly expand between thighs on inhales.',
      benefits: 'Gently stretches hips, thighs, and ankles. Calms the brain and relieves physical and emotional fatigue.',
      contraindications: 'Knee injury or pregnancy (keep knees wide and support hips with pillow).',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Cobra Pose',
      sanskritName: 'Bhujangasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.PRONE,
      targetedBodyAreas: 'Spine, Lower Back, Chest, Shoulders, Abdomen',
      durationSeconds: 45,
      instructions: 'Lie face down with legs extended together. Place hands under shoulders, elbows hugged close to ribs. Press tops of feet and pubic bone into the mat. On an inhale, gently lift chest away from mat without pushing entirely into hands. Keep gaze softly forward.',
      breathingGuidance: 'Inhale while expanding the chest and heart forward; exhale softly maintaining length without compressing lower back.',
      benefits: 'Strengthens entire spinal column, opens heart and lungs, firms glutes, helps ease fatigue.',
      contraindications: 'Pregnancy, recent abdominal surgery, acute back spasms.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Bridge Pose',
      sanskritName: 'Setu Bandha Sarvangasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.SUPINE,
      targetedBodyAreas: 'Glutes, Hamstrings, Chest, Neck, Spine',
      durationSeconds: 60,
      instructions: 'Lie on back with knees bent and feet flat on the floor, hip-width apart. Arms rest by sides with fingertips brushing heels. Press firmly into feet and lift hips toward the ceiling. Interlace fingers underneath and roll shoulders under for support.',
      breathingGuidance: 'Deep rhythmic breathing into high chest. Avoid collapsing hips on exhales.',
      benefits: 'Stretches chest, neck, and spine. Rejuvenates tired legs, aids digestion, calms mind and reduces anxiety.',
      contraindications: 'Neck injury (avoid rolling onto cervical spine; use folded blanket under shoulders).',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Cat-Cow Flow',
      sanskritName: 'Marjaryasana-Bitilasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.RESTORATIVE,
      targetedBodyAreas: 'Spine, Neck, Torso, Pelvis, Core',
      durationSeconds: 60,
      instructions: 'Begin on all fours, hands under shoulders and knees under hips. On inhale (Cow), drop belly toward floor, lift chest and tailbone, gaze up. On exhale (Cat), round spine toward sky, tuck tailbone, and release crown of head toward floor. Flow seamlessly.',
      breathingGuidance: 'Synchronize movement with breath: Inhale expands into cow, exhale empties completely into cat.',
      benefits: 'Warms up spine, improves spinal fluid circulation, relieves back stiffness, synchronizes breath with movement.',
      contraindications: 'Severe wrist strain (use fists or forearms) or chronic neck injury.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Seated Forward Bend',
      sanskritName: 'Paschimottanasana',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.SEATED,
      targetedBodyAreas: 'Hamstrings, Spine, Lower Back, Calves',
      durationSeconds: 75,
      instructions: 'Sit erect with legs straight in front. Flex feet. Inhale reach arms high above head to lengthen spine. Exhale hinge forward from hip joints, keeping back flat. Hold feet, shins, or a strap. With each inhale lengthen torso; with each exhale soften deeper.',
      breathingGuidance: 'Slow, deep exhalations allowing parasympathetic relaxation in hamstrings.',
      benefits: 'Stretches entire posterior chain, massages abdominal organs, lowers blood pressure, calms mind.',
      contraindications: 'Asthma flare-ups, herniated lumbar disc (bend knees generously).',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Extended Triangle Pose',
      sanskritName: 'Utthita Trikonasana',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.STANDING,
      targetedBodyAreas: 'Hips, Hamstrings, Groin, Spine, Chest',
      durationSeconds: 45,
      instructions: 'Stand wide. Turn right foot 90 degrees and back foot in 15 degrees. Inhale arms parallel to floor. Exhale reach torso far right, then hinge down placing right hand on shin, block, or floor. Extend left arm straight up toward ceiling. Keep chest open.',
      breathingGuidance: 'Breathe into open ribcage. Feel ribcage expand in 360 degrees.',
      benefits: 'Increases hip flexibility, relieves back pain, stimulates digestion, improves spinal lateral mobility.',
      contraindications: 'Low blood pressure or heart conditions (keep top hand on hip).',
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Half Lord of the Fishes',
      sanskritName: 'Ardha Matsyendrasana',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.SEATED,
      targetedBodyAreas: 'Spine, Shoulders, Neck, Hips, Abdomen',
      durationSeconds: 45,
      instructions: 'Sit with legs extended. Bend left knee and bring left heel outside right hip. Cross right foot over left knee, planting right foot flat. Sit tall. Wrap left arm around right knee and place right hand on floor behind sacrum. Gently twist to the right.',
      breathingGuidance: 'Inhale to grow tall through crown; exhale to gently deepen the twist from thoracic spine.',
      benefits: 'Detoxifies abdominal organs, keeps spine supple, relieves sciatica and back discomfort.',
      contraindications: 'Severe back or spine injury, pregnancy (twist open instead).',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Plank Pose',
      sanskritName: 'Phalakasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.PRONE,
      targetedBodyAreas: 'Core, Shoulders, Wrists, Glutes, Back',
      durationSeconds: 45,
      instructions: 'From hands and knees or downward dog, align shoulders directly over wrists. Step feet back so body forms a straight diagonal line from heels to crown. Draw navel in firmly. Press floor away through shoulder blades.',
      breathingGuidance: 'Steady, uninterrupted breathing. Avoid holding breath while bearing weight.',
      benefits: 'Builds core strength, tones abdominal wall, stabilizes scapula and wrists, builds mental endurance.',
      contraindications: 'Carpal tunnel syndrome or high blood pressure.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Upward-Facing Dog',
      sanskritName: 'Urdhva Mukha Svanasana',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.PRONE,
      targetedBodyAreas: 'Spine, Wrists, Arms, Chest, Abdomen',
      durationSeconds: 30,
      instructions: 'From prone position, place hands beside lower ribs. Press tops of feet firmly into the floor. On an inhale, straighten arms fully, lifting torso, hips, and knees completely off the floor. Roll shoulders back and broaden chest.',
      breathingGuidance: 'Inhale expansively as chest radiates forward. Exhale maintaining active leg engagement.',
      benefits: 'Strengthens wrists and arms, expands chest and lungs, stimulates abdominal organs, improves posture.',
      contraindications: 'Back injury, carpal tunnel, pregnancy.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Crow Pose',
      sanskritName: 'Bakasana',
      difficulty: Difficulty.ADVANCED,
      category: PoseCategory.BALANCING,
      targetedBodyAreas: 'Wrists, Forearms, Core, Hip Flexors',
      durationSeconds: 30,
      instructions: 'Squat with feet close together and hands flat on mat, shoulder-width apart. Spread fingers. Lift hips high and place knees high on the backs of upper triceps. Lean weight forward onto hands. Lift one foot, then the other, balancing solely on hands.',
      breathingGuidance: 'Controlled shallow diaphragmatic breathing. Focus eyes forward, not straight down.',
      benefits: 'Strengthens wrists, arms, and deep core stabilizers. Builds supreme body confidence and balance.',
      contraindications: 'Carpal tunnel syndrome, wrist sprains, pregnancy.',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Warrior III',
      sanskritName: 'Virabhadrasana III',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.BALANCING,
      targetedBodyAreas: 'Ankles, Calves, Hamstrings, Back, Abdominals',
      durationSeconds: 45,
      instructions: 'From high lunge, shift weight into front standing foot. Hinge forward at hip, lifting back leg behind you parallel to the floor. Extend arms forward or back alongside body. Level hips towards floor, flexing back foot.',
      breathingGuidance: 'Even breathing into chest. Focus on a non-moving point on the floor.',
      benefits: 'Develops full-body balance, tones legs and core, strengthens spinal muscles.',
      contraindications: 'High blood pressure, severe balance impairments.',
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Camel Pose',
      sanskritName: 'Ustrasana',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.SEATED,
      targetedBodyAreas: 'Chest, Abdomen, Quadriceps, Throat, Spine',
      durationSeconds: 45,
      instructions: 'Kneel with knees hip-width apart. Place hands on sacrum with fingers pointing down. Press hips forward, lift sternum toward ceiling, and arch back gently. If comfortable, reach hands back to grasp heels. Keep neck comfortable.',
      breathingGuidance: 'Full inhalation opening thoracic cavity. Do not restrict breath in the throat.',
      benefits: 'Increases thoracic flexibility, opens respiratory passages, counteracts slouching and desk fatigue.',
      contraindications: 'Severe neck or lower back injury, migraines.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Pigeon Pose',
      sanskritName: 'Eka Pada Rajakapotasana',
      difficulty: Difficulty.INTERMEDIATE,
      category: PoseCategory.SEATED,
      targetedBodyAreas: 'Glutes, Hip Rotators, Groin, Psoas',
      durationSeconds: 90,
      instructions: 'From downward dog, slide right knee forward behind right wrist. Lay right shin diagonally across mat. Slide left leg straight back behind you with top of foot flat. Square hips. Inhale lift spine, exhale fold forward over front shin.',
      breathingGuidance: 'Long, releasing exhalations to soften deep tension stored in the outer hip.',
      benefits: 'Deep external hip opener, releases emotional tension, relieves sciatica symptoms.',
      contraindications: 'Knee injury or sacroiliac joint instability.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Chair Pose',
      sanskritName: 'Utkatasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.STANDING,
      targetedBodyAreas: 'Thighs, Glutes, Ankles, Spine, Shoulders',
      durationSeconds: 45,
      instructions: 'Stand with feet together. Inhale raise arms overhead. Exhale bend knees as if sitting down into an imaginary chair. Keep weight back in heels so knees do not jut past toes. Engage core and lift chest.',
      breathingGuidance: 'Breathe deeply into diaphragm to sustain leg heat and muscular engagement.',
      benefits: 'Strengthens thighs and calves, stimulates heart and diaphragm, tones core muscles.',
      contraindications: 'Low blood pressure or acute knee pain.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Corpse Pose',
      sanskritName: 'Savasana',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.RESTORATIVE,
      targetedBodyAreas: 'Entire Body, Mind, Parasympathetic System',
      durationSeconds: 300,
      instructions: 'Lie flat on back with legs naturally falling open. Rest arms alongside body with palms turned upward. Close eyes gently. Release all physical effort, muscle control, and breath manipulation. Allow body to dissolve into relaxation.',
      breathingGuidance: 'Natural, spontaneous, effortless breath. Observe without directing.',
      benefits: 'Calms central nervous system, lowers cortisol, integrates benefits of practice, induces deep meditative restoration.',
      contraindications: 'None. In late pregnancy, lie on left side supported by bolsters.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Legs-Up-the-Wall',
      sanskritName: 'Viparita Karani',
      difficulty: Difficulty.BEGINNER,
      category: PoseCategory.RESTORATIVE,
      targetedBodyAreas: 'Hamstrings, Feet, Lower Back, Nervous System',
      durationSeconds: 180,
      instructions: 'Sit with one hip touching a wall. Gently pivot and swing legs up onto the wall while lying back flat on the floor. Rest arms comfortably out to the sides. Soften belly, eyes, and jaw. Stay for 3 to 10 minutes.',
      breathingGuidance: 'Slow, soothing 4-count inhale and 6-count exhale to induce restful parasympathetic calm.',
      benefits: 'Relieves tired and swollen legs, gently stretches back of neck and hamstrings, promotes restful sleep.',
      contraindications: 'Glaucoma, detached retina, or serious neck conditions.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      englishName: 'Headstand',
      sanskritName: 'Sirsasana',
      difficulty: Difficulty.ADVANCED,
      category: PoseCategory.INVERSION,
      targetedBodyAreas: 'Shoulders, Arms, Core, Neck, Brain Circulation',
      durationSeconds: 60,
      instructions: 'Interlace fingers and place forearms on mat with elbows shoulder-width. Crown of head rests lightly inside clasped hands. Straighten legs, walk feet toward head until hips stack above shoulders. Engage core, lift legs smoothly into vertical alignment.',
      breathingGuidance: 'Steady, non-strained breathing. Avoid holding breath while inverted.',
      benefits: 'King of asanas: improves blood flow to brain, boosts pituitary gland function, strengthens core and upper body.',
      contraindications: 'High blood pressure, neck injury, detached retina, menstruation.',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdPoses = [];
  for (const p of posesData) {
    const pose = await prisma.yogaPose.create({ data: p });
    createdPoses.push(pose);
  }

  console.log(`Created ${createdPoses.length} Yoga Poses.`);

  // 6. Programs
  const programsData = [
    {
      title: '7-Day Yoga for Beginners',
      slug: '7-day-yoga-for-beginners',
      description: 'The definitive introduction to authentic mindful yoga. Build foundational alignment, open stiff joints, and cultivate peaceful daily habits with step-by-step guidance.',
      difficulty: Difficulty.BEGINNER,
      category: ProgramCategory.BEGINNERS,
      totalDurationMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      poseSlugs: ['Mountain Pose', 'Cat-Cow Flow', 'Downward-Facing Dog', 'Warrior II', 'Child’s Pose', 'Corpse Pose'],
    },
    {
      title: 'Morning Energy & Alignment',
      slug: 'morning-energy-and-alignment',
      description: 'Awaken your spine, ignite your digestive fire, and center your thoughts before stepping into the day with this vibrant, energizing morning flow.',
      difficulty: Difficulty.BEGINNER,
      category: ProgramCategory.MORNING,
      totalDurationMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      poseSlugs: ['Mountain Pose', 'Cat-Cow Flow', 'Downward-Facing Dog', 'Warrior I', 'Extended Triangle Pose', 'Tree Pose', 'Child’s Pose'],
    },
    {
      title: 'Flexibility & Mobility',
      slug: 'flexibility-and-mobility',
      description: 'A transformative series targeting tight hamstrings, hip flexors, and thoracic stiffness. Unwind muscular holding patterns with mindful breath awareness.',
      difficulty: Difficulty.INTERMEDIATE,
      category: ProgramCategory.FLEXIBILITY,
      totalDurationMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      poseSlugs: ['Cat-Cow Flow', 'Downward-Facing Dog', 'Extended Triangle Pose', 'Pigeon Pose', 'Seated Forward Bend', 'Bridge Pose', 'Corpse Pose'],
    },
    {
      title: 'Relaxation & Mindfulness',
      slug: 'relaxation-and-mindfulness',
      description: 'Soothe an overactive nervous system, soften anxiety, and transition into restorative equilibrium through gentle restorative poses and grounding breaths.',
      difficulty: Difficulty.BEGINNER,
      category: ProgramCategory.STRESS_RELIEF,
      totalDurationMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
      poseSlugs: ['Child’s Pose', 'Cat-Cow Flow', 'Bridge Pose', 'Legs-Up-the-Wall', 'Corpse Pose'],
    },
    {
      title: 'Desk Break Yoga',
      slug: 'desk-break-yoga',
      description: 'A 10-minute quick antidote for sedentary strain, tech neck, and shoulder tightness. Can be done anytime during your workday without special equipment.',
      difficulty: Difficulty.BEGINNER,
      category: ProgramCategory.DESK_BREAK,
      totalDurationMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
      poseSlugs: ['Mountain Pose', 'Cat-Cow Flow', 'Tree Pose', 'Half Lord of the Fishes', 'Child’s Pose'],
    },
    {
      title: 'Evening Wind-Down Routine',
      slug: 'evening-wind-down-routine',
      description: 'Release the mental clutter of the day and prepare your body for deep, rejuvenating sleep through gentle, non-stimulating floor poses.',
      difficulty: Difficulty.BEGINNER,
      category: ProgramCategory.EVENING,
      totalDurationMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      poseSlugs: ['Child’s Pose', 'Seated Forward Bend', 'Bridge Pose', 'Legs-Up-the-Wall', 'Corpse Pose'],
    },
  ];

  const createdPrograms = [];
  for (const prog of programsData) {
    const { poseSlugs, ...rest } = prog;
    const program = await prisma.yogaProgram.create({ data: rest });
    createdPrograms.push(program);

    // Link poses
    let order = 0;
    for (const poseName of poseSlugs) {
      const match = createdPoses.find((p) => p.englishName === poseName);
      if (match) {
        let section: SectionType = SectionType.MAIN;
        if (order === 0) section = SectionType.WARMUP;
        if (order >= poseSlugs.length - 1) section = SectionType.COOLDOWN;

        await prisma.programPose.create({
          data: {
            programId: program.id,
            poseId: match.id,
            orderIndex: order++,
            customDurationSeconds: match.durationSeconds,
            section,
          },
        });
      }
    }
  }

  console.log(`Created ${createdPrograms.length} Yoga Programs with poses.`);

  // Enroll demo user in "7-Day Yoga for Beginners"
  const beginnerProg = createdPrograms[0];
  await prisma.programEnrollment.create({
    data: {
      userId: demoUser.id,
      programId: beginnerProg.id,
      status: EnrollmentStatus.ACTIVE,
      progressPercent: 42,
      completedSessions: 3,
      lastPracticedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  // Seed sample practice sessions for demo user (last 5 days)
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  await prisma.practiceSession.createMany({
    data: [
      {
        userId: demoUser.id,
        programId: beginnerProg.id,
        sessionTitle: '7-Day Yoga: Day 1 Awakening Foundation',
        durationSeconds: 900,
        targetDurationSeconds: 900,
        completed: true,
        startedAt: daysAgo(3),
        completedAt: daysAgo(3),
        notes: 'Felt calm and refreshed. Loved the focus on breathing in Child Pose.',
      },
      {
        userId: demoUser.id,
        programId: beginnerProg.id,
        sessionTitle: '7-Day Yoga: Day 2 Grounding & Alignment',
        durationSeconds: 920,
        targetDurationSeconds: 900,
        completed: true,
        startedAt: daysAgo(2),
        completedAt: daysAgo(2),
        notes: 'Warrior II felt strong today. Improved leg balance.',
      },
      {
        userId: demoUser.id,
        programId: beginnerProg.id,
        sessionTitle: '7-Day Yoga: Day 3 Gentle Spine Rejuvenation',
        durationSeconds: 880,
        targetDurationSeconds: 900,
        completed: true,
        startedAt: daysAgo(1),
        completedAt: daysAgo(1),
        notes: 'Helped ease lower back tension after sitting at desk.',
      },
    ],
  });

  // 7. Seed Educational Articles for Yoga Awareness Hub
  const articlesData = [
    {
      title: 'Yoga Fundamentals: Beyond the Physical Postures',
      slug: 'yoga-fundamentals-beyond-physical-postures',
      category: 'Yoga Basics',
      summary: 'Discover how yoga originated not merely as exercise, but as a comprehensive spiritual science uniting breath, body, and consciousness.',
      readTimeMinutes: 6,
      author: 'Master Yogi Arya',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      content: `### What is Yoga Truly About?

The word **Yoga** derives from the Sanskrit root *yuj*, meaning to yoke, unite, or harmonize. In classical tradition, yoga is not primarily about touching your toes; it is about what you learn about yourself on the way down.

Centuries before modern wellness studios, ancient sages recognized that the human being functions as an interconnected triad:
1. **The Physical Body (Annamaya Kosha)**: Requiring mindful movement, nourishment, and rest.
2. **The Vital Breath (Pranamaya Kosha)**: Regulating vital energy, emotions, and nervous system tone.
3. **The Mind & Consciousness (Manomaya & Vijnanamaya Koshas)**: Developing discernment, inner peace, and equanimity.

### The Holistic Journey
When practiced with sincere awareness, yoga shifts the nervous system from chronic sympathetic fight-or-flight into parasympathetic restorative flow. As Patanjali famously stated in Yoga Sutra 1.2: *"Yogas chitta vritti nirodha"* — Yoga is the calming of the fluctuations of consciousness.`,
    },
    {
      title: 'The Power of Pranayama: A Beginner’s Guide to Yogic Breathing',
      slug: 'power-of-pranayama-yogic-breathing-guide',
      category: 'Breathing Exercises',
      summary: 'Explore foundational breathwork techniques like Nadi Shodhana, Bhramari, and Diaphragmatic Breath to dissolve stress in minutes.',
      readTimeMinutes: 5,
      author: 'Priya Sharma & Arya Wellness',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      content: `### Breath as the Bridge

In yoga, **Pranayama** is the conscious expansion (*ayama*) of life force (*prana*). Your breathing is the only autonomic bodily function that you can also consciously control at will.

#### Three Foundational Practices:

1. **Dirgha Pranayama (Three-Part Breath)**:
   - Fill the lower abdomen, expand the middle ribcage, and finally lift the upper collarbones.
   - Slowly release in reverse. Practicing for 3–5 minutes relieves shallow anxiety breathing.

2. **Nadi Shodhana (Alternate Nostril Breathing)**:
   - Gently seal right nostril with thumb; inhale left nostril for 4 counts.
   - Seal both nostrils gently; exhale right nostril for 4 counts.
   - Inhale right; exhale left. Balances both brain hemispheres.

3. **Bhramari (Humming Bee Breath)**:
   - Close eyes, inhale deeply, and on exhalation produce a gentle, continuous humming vibration like a bee.
   - Instantly lowers heart rate and soothes mental agitation.`,
    },
    {
      title: 'Meditation Made Simple: Cultivating Stillness in Daily Life',
      slug: 'meditation-made-simple-cultivating-stillness',
      category: 'Meditation Guides',
      summary: 'Practical, accessible advice for beginners intimidated by silent sitting. Learn how 5 minutes of daily mindfulness rewires your attention.',
      readTimeMinutes: 7,
      author: 'Master Yogi Arya',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      content: `### The Myth of the "Empty Mind"

Many beginners abandon meditation believing their goal is to completely stop all thoughts. In truth, thoughts are what the brain naturally produces — meditation is simply the art of observing them without becoming entangled.

#### How to Begin in 5 Simple Steps:
1. **Find a Dignified Seat**: Sit comfortably on a cushion or chair with an upright spine.
2. **Anchor Your Attention**: Rest awareness on the gentle sensation of breath passing across the upper lip.
3. **Notice the Drift**: When thoughts arise (and they will), acknowledge them warmly without judgment.
4. **Gently Return**: Bring awareness back to the anchor. Each return is like a mental rep strengthening your attention muscle.
5. **Consistency Over Duration**: 5 minutes every single morning yields far greater transformation than 45 minutes once a month.`,
    },
    {
      title: 'Debunking Common Yoga Myths: Facts vs Fiction',
      slug: 'debunking-common-yoga-myths-facts-vs-fiction',
      category: 'Myths vs Facts',
      summary: 'Do you need to be flexible to start? Is yoga a religion? We separate ancient truths from modern misconceptions.',
      readTimeMinutes: 5,
      author: 'YogaLife Research Team',
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
      content: `### Separating Truth from Stereotypes

- **Myth 1: "I am not flexible enough for yoga."**
  *Fact*: Saying you are too stiff for yoga is like saying you are too dirty to take a shower. Flexibility is the *outcome* of practice, not the prerequisite.

- **Myth 2: "Yoga is a religion."**
  *Fact*: Yoga is a philosophical science and methodology of holistic wellness developed in ancient India. People of every faith, cultural background, or secular worldview practice yoga fruitfully.

- **Myth 3: "Yoga is too gentle to build strength."**
  *Fact*: Holding isometric bodyweight postures like Plank, Chaturanga, and Warrior III builds functional endurance, joint stability, and core resilience without the wear-and-tear of heavy machinery.`,
    },
    {
      title: 'Yoga for Students: Boosting Focus, Memory, and Exam Calm',
      slug: 'yoga-for-students-focus-memory-calm',
      category: 'Yoga for Students',
      summary: 'Practical micro-practices designed to defeat study fatigue, brain fog, and academic performance anxiety.',
      readTimeMinutes: 6,
      author: 'YogaLife Wellness Team',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
      content: `### The Cognitive Benefits of Yogic Practice

During intense study periods, prolonged sitting compresses blood flow and triggers cognitive exhaustion. Research confirms that even 10 minutes of yogic movement increases prefrontal cortex oxygenation.

#### Recommended 10-Minute Study Break:
- **1 min**: Seated cat-cow to release thoracic stiffness.
- **2 min**: Standing forward bend (Uttanasana) with knees soft to encourage fresh cerebral blood circulation.
- **3 min**: Tree Pose (Vrksasana) to sharpen neural focus and balance.
- **4 min**: Box breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s) to calm exam anxiety.`,
    },
    {
      title: 'The Desk Worker’s Antidote: Combating Sedentary Strain',
      slug: 'desk-workers-antidote-sedentary-strain',
      category: 'Office Yoga',
      summary: 'Alleviate forward-head posture, lower back aches, and carpal tunnel syndrome with ergonomic yoga stretches.',
      readTimeMinutes: 5,
      author: 'Ergonomics & Movement Council',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      content: `### Understanding "Tech Neck" and Postural Fatigue

The human head weighs approximately 10–12 lbs in neutral alignment. Tilted forward 45 degrees over a keyboard or smartphone, effective load on the cervical spine increases to nearly 49 lbs!

#### Quick Desktop Countermeasures:
1. **Shoulder Flossing & Chest Expansion**: Interlace fingers behind back and gently roll shoulder blades together.
2. **Seated Spinal Twist**: Place right hand on chair back, lengthen crown, and exhale softly into an open twist.
3. **Wrist & Forearm Release**: Extend arm forward with fingers pointing down, gently pulling fingers toward body for 30 seconds.`,
    },
    {
      title: 'Practicing Safely: Essential Alignment and Injury Prevention',
      slug: 'practicing-safely-essential-alignment-prevention',
      category: 'Safety & Precautions',
      summary: 'Protect your knees, wrists, and lumbar spine by cultivating body awareness and honoring anatomical differences.',
      readTimeMinutes: 7,
      author: 'Master Yogi Arya',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      content: `### Ahimsa: Non-Violence Toward Your Own Body

The first ethical principle of classical yoga is **Ahimsa** (non-harm). No posture is worth an injury. 

#### Golden Rules for Safe Practice:
- **Pain vs Sensations**: Warm muscular effort or gentle stretching is healthy; sharp, pinching, electric, or joint pain is an immediate signal to back off.
- **Protect the Knees**: Never force the foot into lotus or pigeon if you feel twisting in the knee joint.
- **Engage the Core in Backbends**: Lengthen the tailbone down and pull the lower belly in to prevent compressing the lumbar vertebrae.
- **Consult Medical Professionals**: Those with glaucoma, high blood pressure, disc herniations, or pregnancy should adapt inversions and deep twists appropriately.`,
    },
    {
      title: 'The Eight Limbs of Patanjali’s Yoga Philosophy Explained',
      slug: 'eight-limbs-patanjali-yoga-philosophy-explained',
      category: 'Yoga Basics',
      summary: 'An illuminating overview of Ashtanga: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, and Samadhi.',
      readTimeMinutes: 8,
      author: 'Master Yogi Arya',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      content: `### The Classical Eightfold Path (Ashtanga)

In the *Yoga Sutras*, the sage Patanjali systematized yoga into eight distinct limbs forming an integrated tree of wisdom:

1. **Yama (Universal Ethics)**: Ahimsa (non-violence), Satya (truthfulness), Asteya (non-stealing), Brahmacharya (moderation), Aparigraha (non-greed).
2. **Niyama (Personal Observances)**: Saucha (purity), Santosha (contentment), Tapas (discipline), Svadhyaya (self-study), Ishvara Pranidhana (surrender).
3. **Asana (Physical Postures)**: Steady and comfortable embodiment (*sthira sukham asanam*).
4. **Pranayama (Breath Mastery)**: Expansion and refinement of vitality.
5. **Pratyahara (Sense Inwardness)**: Drawing sensory awareness inward away from external distractions.
6. **Dharana (One-Pointed Concentration)**: Steadying the mind on a singular focal point.
7. **Dhyana (Uninterrupted Meditation)**: Continuous, effortless flow of awareness.
8. **Samadhi (Integrated Wholeness)**: Transcendent state of peace, clarity, and oneness with all existence.`,
    },
  ];

  for (const art of articlesData) {
    await prisma.article.create({ data: art });
  }

  console.log(`Created ${articlesData.length} Educational Articles.`);

  // 8. Seed Upcoming Events
  const futureDays = (days: number, hour: number = 10) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const eventsData = [
    {
      title: 'Sunrise Prana Flow — Weekend Virtual Masterclass',
      description: 'Join Master Yogi Arya for an immersive 75-minute live stream session exploring classical Sun Salutations, invigorating breathwork, and guided morning meditation.',
      eventType: EventType.ONLINE,
      venue: 'Zoom Live Stream (Link sent upon registration)',
      eventDate: futureDays(3, 7),
      durationMinutes: 75,
      instructorName: 'Master Yogi Arya',
      maxSeats: 150,
      registeredSeats: 48,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Restorative Sound Bath & Yoga Nidra Immersion',
      description: 'An evening of profound somatic relaxation featuring Tibetan singing bowls, koshi chimes, and a full 45-minute guided Yoga Nidra journey for sleep optimization.',
      eventType: EventType.ONLINE,
      venue: 'YogaLife Virtual Studio',
      eventDate: futureDays(6, 19),
      durationMinutes: 90,
      instructorName: 'Elena Rostova',
      maxSeats: 100,
      registeredSeats: 72,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Spine & Posture Alignment Workshop',
      description: 'Hands-on intensive for desk professionals, athletes, and yoga teachers. Learn therapeutic sequencing to unravel thoracic kyphosis and anterior pelvic tilt.',
      eventType: EventType.OFFLINE,
      venue: 'Prana Sanctuary, 42 Harmony Blvd, Green Wellness Center',
      eventDate: futureDays(12, 10),
      durationMinutes: 120,
      instructorName: 'Dr. Rohan Mehra, PT & Yogi',
      maxSeats: 30,
      registeredSeats: 18,
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Mindful Breathwork & Stress Reduction Retreat',
      description: 'A half-day transformative immersion into ancient Pranayama sciences, polyvagal regulation, and mindful plant-based holistic nutrition.',
      eventType: EventType.OFFLINE,
      venue: 'Serenity Hills Eco-Retreat, Valley Road',
      eventDate: futureDays(20, 9),
      durationMinutes: 240,
      instructorName: 'Master Yogi Arya & Team',
      maxSeats: 25,
      registeredSeats: 14,
      imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const ev of eventsData) {
    const createdEvent = await prisma.event.create({ data: ev });
    // Register demo user to the first event
    if (ev.title.includes('Sunrise Prana Flow')) {
      await prisma.eventRegistration.create({
        data: {
          eventId: createdEvent.id,
          userId: demoUser.id,
          status: RegistrationStatus.CONFIRMED,
        },
      });
    }
  }

  console.log(`Created ${eventsData.length} Community Events.`);

  console.log('✅ Seeding completed successfully!');
  console.log('--- DEFAULT DEMONSTRATION ACCOUNTS ---');
  console.log('👑 Admin: admin@yogalife.com / Admin@123');
  console.log('🧘 User:  demo@yogalife.com  / User@123');
  console.log('--------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
