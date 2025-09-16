"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function BlogPost({ slug }) {
  const router = useRouter();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample blog post data - in a real app, this would come from an API
  const blogPosts = {
    "five-ways-cope-burnout-parenting-adhd": {
      id: 1,
      slug: "five-ways-cope-burnout-parenting-adhd",
      title: "Five ways to cope with burnout when parenting a child with ADHD",
      subtitle: "Learn practical strategies to manage stress and maintain your wellbeing while supporting your child's needs.",
      author: {
        name: "Liz Talago",
        bio: "Liz Talago is a licensed clinical social worker specializing in ADHD and family therapy.",
        image: "/kids.png"
      },
      date: "June 27, 2025",
      lastUpdated: "June 27, 2025",
      categories: ["Parenting", "ADHD", "Mental Health"],
      featuredImage: "/kids.png",
      clinicallyReviewedBy: {
        name: "Dr. Sarah Johnson",
        credentials: "Licensed Clinical Psychologist",
        bio: "Dr. Johnson specializes in ADHD assessment and treatment."
      },
      keyTakeaways: [
        "Recognize the signs of parental burnout early",
        "Establish clear boundaries between caregiving and personal time",
        "Build a support network of family, friends, and professionals",
        "Practice self-compassion and realistic expectations",
        "Seek professional help when needed"
      ],
      content: [
        {
          type: "section",
          heading: "What is parental burnout?",
          content: "Parental burnout is a state of physical, mental, and emotional exhaustion that occurs when parents feel overwhelmed by the demands of caring for their child, especially when that child has additional needs like ADHD. It's not just feeling tired—it's a chronic state of stress that can affect your ability to function effectively as a parent and in other areas of your life."
        },
        {
          type: "section",
          heading: "Why does burnout happen with ADHD parenting?",
          content: "Parenting a child with ADHD comes with unique challenges that can contribute to burnout. The constant need for structure, the emotional dysregulation episodes, the extra advocacy required at school, and the feeling that you're always 'on' can be exhausting. Unlike typical parenting challenges, ADHD-related behaviors often require more intensive, consistent intervention."
        },
        {
          type: "section",
          heading: "Signs you're experiencing parental burnout",
          content: "Recognizing burnout is the first step to addressing it. Common signs include feeling emotionally detached from your child, having difficulty concentrating, feeling irritable or angry more often, experiencing physical symptoms like headaches or stomach issues, and feeling like you're failing as a parent despite your best efforts."
        },
        {
          type: "section",
          heading: "Five strategies to cope with burnout",
          content: "Here are five evidence-based strategies to help you manage parental burnout:"
        },
        {
          type: "list",
          heading: "1. Establish clear boundaries",
          items: [
            "Set specific times for work, family, and personal activities",
            "Communicate your needs clearly to family members",
            "Learn to say 'no' to additional commitments when you're already stretched thin"
          ]
        },
        {
          type: "list",
          heading: "2. Build your support network",
          items: [
            "Connect with other parents of children with ADHD",
            "Join support groups or online communities",
            "Don't hesitate to ask for help from family and friends"
          ]
        },
        {
          type: "list",
          heading: "3. Practice self-compassion",
          items: [
            "Remember that you're doing your best in a challenging situation",
            "Acknowledge your efforts and progress, not just the setbacks",
            "Treat yourself with the same kindness you'd show a friend"
          ]
        },
        {
          type: "list",
          heading: "4. Focus on realistic expectations",
          items: [
            "Accept that progress with ADHD management takes time",
            "Celebrate small victories and improvements",
            "Understand that setbacks are normal and don't reflect your parenting abilities"
          ]
        },
        {
          type: "list",
          heading: "5. Seek professional support",
          items: [
            "Consider therapy for yourself to process the emotional challenges",
            "Work with your child's treatment team to ensure you have adequate support",
            "Explore respite care options to give yourself regular breaks"
          ]
        },
        {
          type: "section",
          heading: "How therapy can help",
          content: "Individual therapy can provide you with a safe space to process the emotional challenges of parenting a child with ADHD. A therapist can help you develop coping strategies, work through feelings of guilt or inadequacy, and provide support as you navigate the complexities of ADHD management. Family therapy can also help improve communication and reduce stress within the family unit."
        }
      ],
      relatedPosts: [
        {
          id: 2,
          title: "Four tips for talking to a psychiatrist about ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/rightside5th.png",
          slug: "four-tips-talking-psychiatrist-adhd"
        },
        {
          id: 3,
          title: "Getting an autism diagnosis from a psychiatrist",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/hero.png",
          slug: "getting-autism-diagnosis-psychiatrist"
        },
        {
          id: 4,
          title: "Managing postpartum sensory overload",
          author: "Saya Des Marais",
          date: "June 26, 2025",
          image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
          slug: "managing-postpartum-sensory-overload"
        }
      ]
    },
    "aroace-aromanticism-asexuality-intersect": {
      id: 2,
      slug: "aroace-aromanticism-asexuality-intersect",
      title: "Aroace: Where aromanticism and asexuality intersect",
      subtitle: "Understanding the intersection of aromantic and asexual identities and how they shape relationships and personal experiences.",
      author: {
        name: "Alex Bachert",
        bio: "Alex Bachert is a mental health advocate and writer specializing in LGBTQ+ issues and identity exploration.",
        image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
      },
      date: "June 27, 2025",
      lastUpdated: "June 27, 2025",
      categories: ["Relationships", "Identity", "Mental Health"],
      featuredImage: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      clinicallyReviewedBy: {
        name: "Dr. Maria Rodriguez",
        credentials: "Licensed Clinical Psychologist",
        bio: "Dr. Rodriguez specializes in LGBTQ+ mental health and identity development."
      },
      keyTakeaways: [
        "Aroace individuals experience both aromantic and asexual orientations",
        "These identities exist on spectrums and can vary in intensity",
        "Understanding these identities helps reduce stigma and isolation",
        "Support and validation are crucial for mental health",
        "Professional help can assist in navigating identity and relationships"
      ],
      content: [
        {
          type: "section",
          heading: "What does aroace mean?",
          content: "Aroace is a term that combines 'aromantic' and 'asexual' to describe individuals who experience both aromanticism (little to no romantic attraction) and asexuality (little to no sexual attraction). This intersection creates a unique experience of relationships and attraction that differs from societal expectations."
        },
        {
          type: "section",
          heading: "Understanding the spectrums",
          content: "Both aromanticism and asexuality exist on spectrums. Some aroace individuals may experience occasional attraction, while others may never experience romantic or sexual attraction. The intensity and frequency of these feelings can vary greatly from person to person."
        },
        {
          type: "section",
          heading: "Common experiences and challenges",
          content: "Aroace individuals often face unique challenges including societal pressure to pursue romantic relationships, difficulty finding representation in media, and navigating friendships that others might interpret as romantic. These challenges can impact mental health and self-esteem."
        },
        {
          type: "section",
          heading: "Building supportive relationships",
          content: "Despite not experiencing romantic or sexual attraction, aroace individuals can form deep, meaningful relationships. These relationships may be platonic, familial, or take other forms that provide emotional support and connection."
        },
        {
          type: "section",
          heading: "Seeking support and validation",
          content: "Finding community and professional support can be incredibly valuable for aroace individuals. Therapy can help with identity exploration, relationship navigation, and addressing any mental health concerns related to societal pressure or isolation."
        }
      ],
      relatedPosts: [
        {
          id: 1,
          title: "Five ways to cope with burnout when parenting a child with ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/kids.png",
          slug: "five-ways-cope-burnout-parenting-adhd"
        },
        {
          id: 5,
          title: "What's self-invalidation?",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/rightside5th.png",
          slug: "what-is-self-invalidation"
        },
        {
          id: 6,
          title: "Embracing emotional vulnerability",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/hero.png",
          slug: "embracing-emotional-vulnerability"
        }
      ]
    },
    "four-tips-talking-psychiatrist-adhd": {
      id: 3,
      slug: "four-tips-talking-psychiatrist-adhd",
      title: "Four tips for talking to a psychiatrist about ADHD",
      subtitle: "How to effectively communicate with your psychiatrist about ADHD symptoms, concerns, and treatment options.",
      author: {
        name: "Liz Talago",
        bio: "Liz Talago is a licensed clinical social worker specializing in ADHD and family therapy.",
        image: "/kids.png"
      },
      date: "June 27, 2025",
      lastUpdated: "June 27, 2025",
      categories: ["ADHD", "Mental Health", "Treatment"],
      featuredImage: "/rightside5th.png",
      clinicallyReviewedBy: {
        name: "Dr. Michael Chen",
        credentials: "Board-Certified Psychiatrist",
        bio: "Dr. Chen specializes in ADHD diagnosis and medication management."
      },
      keyTakeaways: [
        "Prepare specific examples of ADHD symptoms and their impact",
        "Be honest about medication concerns and side effects",
        "Ask questions about treatment options and alternatives",
        "Keep track of symptoms and medication responses",
        "Advocate for yourself and your treatment needs"
      ],
      content: [
        {
          type: "section",
          heading: "Why effective communication matters",
          content: "Clear communication with your psychiatrist is essential for accurate diagnosis and effective treatment. ADHD symptoms can be complex and vary from person to person, so providing detailed information helps your psychiatrist make informed decisions about your care."
        },
        {
          type: "section",
          heading: "Tip 1: Prepare specific examples",
          content: "Before your appointment, think about specific situations where ADHD symptoms have impacted your daily life. Examples might include difficulty focusing during meetings, forgetting important appointments, or struggling with organization at home or work."
        },
        {
          type: "section",
          heading: "Tip 2: Be honest about medication",
          content: "If you're taking or considering medication, be completely honest about any concerns, side effects, or questions you have. Your psychiatrist needs accurate information to adjust dosages or try different medications if needed."
        },
        {
          type: "section",
          heading: "Tip 3: Ask questions about treatment",
          content: "Don't hesitate to ask about different treatment options, including therapy, lifestyle changes, or alternative approaches. Understanding all available options helps you make informed decisions about your care."
        },
        {
          type: "section",
          heading: "Tip 4: Track your progress",
          content: "Keep a journal or notes about how you're feeling, any changes in symptoms, and how treatments are working. This information helps your psychiatrist monitor your progress and make adjustments as needed."
        },
        {
          type: "section",
          heading: "Building a collaborative relationship",
          content: "Remember that you and your psychiatrist are partners in your care. Don't be afraid to advocate for yourself, express concerns, or ask for clarification about any aspect of your treatment plan."
        }
      ],
      relatedPosts: [
        {
          id: 1,
          title: "Five ways to cope with burnout when parenting a child with ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/kids.png",
          slug: "five-ways-cope-burnout-parenting-adhd"
        },
        {
          id: 9,
          title: "Unpacking the relationship between ADHD and sex",
          author: "Brandy Chalmers, LPC",
          date: "June 25, 2025",
          image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
          slug: "relationship-between-adhd-and-sex"
        },
        {
          id: 3,
          title: "Getting an autism diagnosis from a psychiatrist",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/hero.png",
          slug: "getting-autism-diagnosis-psychiatrist"
        }
      ]
    },
    "getting-autism-diagnosis-psychiatrist": {
      id: 4,
      slug: "getting-autism-diagnosis-psychiatrist",
      title: "Getting an autism diagnosis from a psychiatrist",
      subtitle: "Understanding the autism diagnostic process and what to expect when working with a psychiatrist for assessment.",
      author: {
        name: "Liz Talago",
        bio: "Liz Talago is a licensed clinical social worker specializing in ADHD and family therapy.",
        image: "/kids.png"
      },
      date: "June 27, 2025",
      lastUpdated: "June 27, 2025",
      categories: ["Autism", "Mental Health", "Diagnosis"],
      featuredImage: "/hero.png",
      clinicallyReviewedBy: {
        name: "Dr. Jennifer Park",
        credentials: "Developmental Psychologist",
        bio: "Dr. Park specializes in autism assessment and early intervention."
      },
      keyTakeaways: [
        "Autism diagnosis involves comprehensive evaluation across multiple areas",
        "Early diagnosis can lead to better outcomes and support",
        "The process may include interviews, observations, and standardized tests",
        "Family involvement is crucial throughout the assessment process",
        "Post-diagnosis support and resources are essential for success"
      ],
      content: [
        {
          type: "section",
          heading: "Understanding autism spectrum disorder",
          content: "Autism Spectrum Disorder (ASD) is a developmental condition that affects communication, social interaction, and behavior. The spectrum nature means that individuals with autism can have varying degrees of symptoms and support needs."
        },
        {
          type: "section",
          heading: "The diagnostic process",
          content: "Getting an autism diagnosis typically involves a comprehensive evaluation that includes clinical interviews, behavioral observations, standardized assessments, and input from family members, teachers, or other caregivers who know the individual well."
        },
        {
          type: "section",
          heading: "What to expect during assessment",
          content: "The assessment process may take several sessions and can include structured interviews, play-based observations, cognitive testing, and questionnaires. The psychiatrist will look at developmental history, current behaviors, and how symptoms impact daily functioning."
        },
        {
          type: "section",
          heading: "Preparing for the evaluation",
          content: "Before the assessment, gather relevant information including developmental milestones, school reports, previous evaluations, and examples of behaviors or concerns. This information helps provide a complete picture for accurate diagnosis."
        },
        {
          type: "section",
          heading: "After the diagnosis",
          content: "Receiving an autism diagnosis can bring mixed emotions. It's important to remember that a diagnosis is the first step toward accessing appropriate support, services, and interventions that can significantly improve quality of life."
        },
        {
          type: "section",
          heading: "Next steps and support",
          content: "Following diagnosis, work with your healthcare team to develop a comprehensive treatment plan. This may include behavioral interventions, speech therapy, occupational therapy, educational supports, and family counseling."
        }
      ],
      relatedPosts: [
        {
          id: 1,
          title: "Five ways to cope with burnout when parenting a child with ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/kids.png",
          slug: "five-ways-cope-burnout-parenting-adhd"
        },
        {
          id: 2,
          title: "Four tips for talking to a psychiatrist about ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/rightside5th.png",
          slug: "four-tips-talking-psychiatrist-adhd"
        },
        {
          id: 4,
          title: "Managing postpartum sensory overload",
          author: "Saya Des Marais",
          date: "June 26, 2025",
          image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
          slug: "managing-postpartum-sensory-overload"
        }
      ]
    },
    "managing-postpartum-sensory-overload": {
      id: 5,
      slug: "managing-postpartum-sensory-overload",
      title: "Managing postpartum sensory overload",
      subtitle: "Understanding and coping with sensory sensitivity after childbirth, including practical strategies for new mothers.",
      author: {
        name: "Saya Des Marais",
        bio: "Saya Des Marais is a licensed therapist specializing in perinatal mental health and sensory processing.",
        image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
      },
      date: "June 26, 2025",
      lastUpdated: "June 26, 2025",
      categories: ["Parenting", "Mental Health", "Sensory Processing"],
      featuredImage: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      clinicallyReviewedBy: {
        name: "Dr. Emily Watson",
        credentials: "Licensed Clinical Psychologist",
        bio: "Dr. Watson specializes in perinatal mental health and sensory processing disorders."
      },
      keyTakeaways: [
        "Postpartum sensory overload is common and temporary",
        "Hormonal changes can increase sensory sensitivity",
        "Creating a sensory-friendly environment helps",
        "Self-care and rest are essential for recovery",
        "Professional support can provide effective coping strategies"
      ],
      content: [
        {
          type: "section",
          heading: "What is postpartum sensory overload?",
          content: "Postpartum sensory overload occurs when new mothers experience heightened sensitivity to sensory stimuli like sounds, lights, textures, or smells. This can be overwhelming and exhausting, especially when combined with the demands of caring for a newborn."
        },
        {
          type: "section",
          heading: "Why does it happen?",
          content: "Hormonal changes during and after pregnancy can affect how the brain processes sensory information. Additionally, sleep deprivation, stress, and the constant stimulation of caring for a baby can contribute to sensory overwhelm."
        },
        {
          type: "section",
          heading: "Common triggers and symptoms",
          content: "Common triggers include loud noises, bright lights, certain textures, strong smells, or crowded environments. Symptoms may include feeling overwhelmed, irritable, anxious, or having difficulty concentrating when exposed to sensory stimuli."
        },
        {
          type: "section",
          heading: "Coping strategies",
          content: "Managing postpartum sensory overload involves both environmental modifications and self-care practices. Creating quiet spaces, using noise-canceling headphones, taking breaks from stimulating environments, and ensuring adequate rest can all help."
        },
        {
          type: "section",
          heading: "When to seek help",
          content: "If sensory overload significantly impacts your daily functioning, relationships, or mental health, it's important to seek professional support. A therapist can help develop personalized coping strategies and address any underlying concerns."
        }
      ],
      relatedPosts: [
        {
          id: 1,
          title: "Five ways to cope with burnout when parenting a child with ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/kids.png",
          slug: "five-ways-cope-burnout-parenting-adhd"
        },
        {
          id: 5,
          title: "What's self-invalidation?",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/rightside5th.png",
          slug: "what-is-self-invalidation"
        },
        {
          id: 6,
          title: "Embracing emotional vulnerability",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/hero.png",
          slug: "embracing-emotional-vulnerability"
        }
      ]
    },
    "what-is-self-invalidation": {
      id: 6,
      slug: "what-is-self-invalidation",
      title: "What's self-invalidation?",
      subtitle: "Understanding self-invalidation and its impact on mental health, including strategies for building self-compassion.",
      author: {
        name: "Linda Childers",
        bio: "Linda Childers is a licensed clinical social worker specializing in self-compassion and emotional regulation.",
        image: "/rightside5th.png"
      },
      date: "June 26, 2025",
      lastUpdated: "June 26, 2025",
      categories: ["Self-Care", "Mental Health", "Emotional Regulation"],
      featuredImage: "/rightside5th.png",
      clinicallyReviewedBy: {
        name: "Dr. Robert Kim",
        credentials: "Licensed Clinical Psychologist",
        bio: "Dr. Kim specializes in cognitive behavioral therapy and self-compassion interventions."
      },
      keyTakeaways: [
        "Self-invalidation involves dismissing or minimizing your own emotions",
        "It can lead to increased anxiety, depression, and relationship difficulties",
        "Common patterns include self-criticism and emotional suppression",
        "Building self-compassion helps counteract self-invalidation",
        "Therapy can provide effective tools for changing these patterns"
      ],
      content: [
        {
          type: "section",
          heading: "Understanding self-invalidation",
          content: "Self-invalidation is the tendency to dismiss, minimize, or criticize your own emotions, thoughts, or experiences. It often involves telling yourself that your feelings are wrong, irrational, or not important enough to address."
        },
        {
          type: "section",
          heading: "Common patterns of self-invalidation",
          content: "Self-invalidation can take many forms, including telling yourself to 'just get over it,' comparing your problems to others', dismissing your achievements, or believing that your emotions are a sign of weakness."
        },
        {
          type: "section",
          heading: "Impact on mental health",
          content: "Chronic self-invalidation can lead to increased anxiety, depression, low self-esteem, and difficulty forming healthy relationships. It can also make it harder to seek help or support when needed."
        },
        {
          type: "section",
          heading: "Building self-compassion",
          content: "Developing self-compassion involves treating yourself with the same kindness and understanding you would offer a friend. This includes acknowledging your emotions as valid, practicing self-kindness, and recognizing that imperfection is part of being human."
        },
        {
          type: "section",
          heading: "Strategies for change",
          content: "Changing self-invalidation patterns takes time and practice. Strategies include mindfulness meditation, cognitive restructuring, self-compassion exercises, and working with a therapist to identify and change these patterns."
        },
        {
          type: "section",
          heading: "Seeking professional support",
          content: "If self-invalidation is significantly impacting your life, therapy can provide a safe space to explore these patterns and develop healthier ways of relating to yourself. A therapist can help you build self-compassion and emotional regulation skills."
        }
      ],
      relatedPosts: [
        {
          id: 6,
          title: "Embracing emotional vulnerability",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/hero.png",
          slug: "embracing-emotional-vulnerability"
        },
        {
          id: 2,
          title: "Aroace: Where aromanticism and asexuality intersect",
          author: "Alex Bachert",
          date: "June 27, 2025",
          image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
          slug: "aroace-aromanticism-asexuality-intersect"
        },
        {
          id: 5,
          title: "Managing postpartum sensory overload",
          author: "Saya Des Marais",
          date: "June 26, 2025",
          image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
          slug: "managing-postpartum-sensory-overload"
        }
      ]
    },
    "embracing-emotional-vulnerability": {
      id: 7,
      slug: "embracing-emotional-vulnerability",
      title: "Embracing emotional vulnerability",
      subtitle: "Learning to embrace vulnerability as a strength and how it can improve relationships and personal growth.",
      author: {
        name: "Linda Childers",
        bio: "Linda Childers is a licensed clinical social worker specializing in self-compassion and emotional regulation.",
        image: "/hero.png"
      },
      date: "June 26, 2025",
      lastUpdated: "June 26, 2025",
      categories: ["Self-Care", "Relationships", "Personal Growth"],
      featuredImage: "/hero.png",
      clinicallyReviewedBy: {
        name: "Dr. Sarah Mitchell",
        credentials: "Licensed Clinical Psychologist",
        bio: "Dr. Mitchell specializes in attachment theory and relationship counseling."
      },
      keyTakeaways: [
        "Vulnerability is a strength, not a weakness",
        "It allows for deeper, more authentic connections",
        "Fear of vulnerability often stems from past experiences",
        "Practicing vulnerability builds emotional resilience",
        "Therapy can help develop healthy vulnerability skills"
      ],
      content: [
        {
          type: "section",
          heading: "What is emotional vulnerability?",
          content: "Emotional vulnerability is the willingness to be open, honest, and authentic about your feelings, thoughts, and experiences, even when it feels risky or uncomfortable. It involves allowing yourself to be seen and known by others."
        },
        {
          type: "section",
          heading: "Why vulnerability feels scary",
          content: "Vulnerability can feel threatening because it involves the risk of rejection, judgment, or hurt. Past experiences of being hurt or rejected can make it especially difficult to open up to others."
        },
        {
          type: "section",
          heading: "The benefits of vulnerability",
          content: "Despite the risks, vulnerability offers many benefits including deeper relationships, increased authenticity, better emotional regulation, and greater personal growth. It allows others to connect with the real you."
        },
        {
          type: "section",
          heading: "Building vulnerability skills",
          content: "Developing healthy vulnerability involves starting small, choosing safe people to practice with, setting boundaries, and learning to distinguish between healthy vulnerability and oversharing."
        },
        {
          type: "section",
          heading: "Vulnerability in relationships",
          content: "In relationships, vulnerability creates intimacy and trust. It allows partners to understand each other better and provides opportunities for support and connection during difficult times."
        },
        {
          type: "section",
          heading: "Getting support",
          content: "If vulnerability feels particularly challenging, therapy can provide a safe space to practice being open and authentic. A therapist can help you work through fears and develop healthy vulnerability skills."
        }
      ],
      relatedPosts: [
        {
          id: 6,
          title: "What's self-invalidation?",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/rightside5th.png",
          slug: "what-is-self-invalidation"
        },
        {
          id: 2,
          title: "Aroace: Where aromanticism and asexuality intersect",
          author: "Alex Bachert",
          date: "June 27, 2025",
          image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
          slug: "aroace-aromanticism-asexuality-intersect"
        },
        {
          id: 1,
          title: "Five ways to cope with burnout when parenting a child with ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/kids.png",
          slug: "five-ways-cope-burnout-parenting-adhd"
        }
      ]
    },
    "how-psychiatry-help-quit-drinking-alcohol": {
      id: 8,
      slug: "how-psychiatry-help-quit-drinking-alcohol",
      title: "How psychiatry can help you quit drinking alcohol",
      subtitle: "Understanding the role of psychiatric treatment in alcohol recovery and the various approaches available.",
      author: {
        name: "Liz Talago",
        bio: "Liz Talago is a licensed clinical social worker specializing in ADHD and family therapy.",
        image: "/hero.png"
      },
      date: "June 26, 2025",
      lastUpdated: "June 26, 2025",
      categories: ["Psychiatry", "Addiction", "Mental Health"],
      featuredImage: "/hero.png",
      clinicallyReviewedBy: {
        name: "Dr. James Wilson",
        credentials: "Board-Certified Psychiatrist",
        bio: "Dr. Wilson specializes in addiction medicine and dual diagnosis treatment."
      },
      keyTakeaways: [
        "Psychiatric treatment addresses underlying mental health conditions",
        "Medication can help manage withdrawal symptoms and cravings",
        "Therapy provides coping strategies and emotional support",
        "Integrated treatment addresses both addiction and mental health",
        "Recovery is a process that requires ongoing support"
      ],
      content: [
        {
          type: "section",
          heading: "The role of psychiatry in alcohol recovery",
          content: "Psychiatric treatment plays a crucial role in alcohol recovery by addressing underlying mental health conditions, managing withdrawal symptoms, and providing comprehensive care for both addiction and co-occurring disorders."
        },
        {
          type: "section",
          heading: "Medication-assisted treatment",
          content: "Psychiatrists can prescribe medications to help manage alcohol withdrawal, reduce cravings, and treat co-occurring mental health conditions. These medications can make the recovery process safer and more manageable."
        },
        {
          type: "section",
          heading: "Therapeutic approaches",
          content: "Psychiatric treatment often includes various forms of therapy such as cognitive behavioral therapy, motivational interviewing, and group therapy. These approaches help individuals develop coping strategies and address underlying issues."
        },
        {
          type: "section",
          heading: "Dual diagnosis treatment",
          content: "Many people with alcohol use disorder also have co-occurring mental health conditions like depression, anxiety, or PTSD. Integrated treatment addresses both conditions simultaneously for better outcomes."
        },
        {
          type: "section",
          heading: "The recovery process",
          content: "Recovery from alcohol use disorder is a long-term process that requires ongoing support. Psychiatric treatment provides the foundation for sustained recovery through medication management, therapy, and relapse prevention strategies."
        },
        {
          type: "section",
          heading: "Getting started",
          content: "If you're considering psychiatric treatment for alcohol recovery, start by consulting with a psychiatrist who specializes in addiction medicine. They can assess your needs and develop a comprehensive treatment plan."
        }
      ],
      relatedPosts: [
        {
          id: 8,
          title: "How can a psychiatrist support PTSD treatment?",
          author: "Liz Talago",
          date: "June 26, 2025",
          image: "/rightside5th.png",
          slug: "psychiatrist-support-ptsd-treatment"
        },
        {
          id: 2,
          title: "Four tips for talking to a psychiatrist about ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/rightside5th.png",
          slug: "four-tips-talking-psychiatrist-adhd"
        },
        {
          id: 3,
          title: "Getting an autism diagnosis from a psychiatrist",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/hero.png",
          slug: "getting-autism-diagnosis-psychiatrist"
        }
      ]
    },
    "psychiatrist-support-ptsd-treatment": {
      id: 9,
      slug: "psychiatrist-support-ptsd-treatment",
      title: "How can a psychiatrist support PTSD treatment?",
      subtitle: "Understanding the comprehensive role of psychiatric care in PTSD treatment and recovery.",
      author: {
        name: "Liz Talago",
        bio: "Liz Talago is a licensed clinical social worker specializing in ADHD and family therapy.",
        image: "/rightside5th.png"
      },
      date: "June 26, 2025",
      lastUpdated: "June 26, 2025",
      categories: ["Psychiatry", "PTSD", "Trauma"],
      featuredImage: "/rightside5th.png",
      clinicallyReviewedBy: {
        name: "Dr. Amanda Foster",
        credentials: "Board-Certified Psychiatrist",
        bio: "Dr. Foster specializes in trauma-informed care and PTSD treatment."
      },
      keyTakeaways: [
        "Psychiatrists provide comprehensive PTSD treatment",
        "Medication can help manage PTSD symptoms",
        "Therapy is often combined with medication for best results",
        "Treatment addresses both symptoms and underlying trauma",
        "Recovery from PTSD is possible with proper support"
      ],
      content: [
        {
          type: "section",
          heading: "Understanding PTSD",
          content: "Post-Traumatic Stress Disorder (PTSD) is a mental health condition that can develop after experiencing or witnessing a traumatic event. Symptoms may include flashbacks, nightmares, hypervigilance, and emotional numbness."
        },
        {
          type: "section",
          heading: "The psychiatrist's role in PTSD treatment",
          content: "Psychiatrists play a crucial role in PTSD treatment by providing comprehensive assessment, medication management, and coordinating care with other mental health professionals. They can help address both the biological and psychological aspects of PTSD."
        },
        {
          type: "section",
          heading: "Medication options",
          content: "Psychiatrists may prescribe various medications to help manage PTSD symptoms, including antidepressants, anti-anxiety medications, and sleep aids. These medications can help reduce symptoms and improve quality of life."
        },
        {
          type: "section",
          heading: "Integrated treatment approach",
          content: "Effective PTSD treatment often combines medication with evidence-based therapies like cognitive processing therapy, EMDR, or prolonged exposure therapy. Psychiatrists coordinate this integrated approach."
        },
        {
          type: "section",
          heading: "Addressing co-occurring conditions",
          content: "Many people with PTSD also have co-occurring conditions like depression, anxiety, or substance use disorders. Psychiatrists can address these conditions simultaneously for comprehensive treatment."
        },
        {
          type: "section",
          heading: "The recovery journey",
          content: "Recovery from PTSD is a process that takes time and support. Psychiatrists provide ongoing care, monitor progress, and adjust treatment as needed to support long-term recovery and healing."
        }
      ],
      relatedPosts: [
        {
          id: 8,
          title: "How psychiatry can help you quit drinking alcohol",
          author: "Liz Talago",
          date: "June 26, 2025",
          image: "/hero.png",
          slug: "how-psychiatry-help-quit-drinking-alcohol"
        },
        {
          id: 2,
          title: "Four tips for talking to a psychiatrist about ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/rightside5th.png",
          slug: "four-tips-talking-psychiatrist-adhd"
        },
        {
          id: 6,
          title: "What's self-invalidation?",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/rightside5th.png",
          slug: "what-is-self-invalidation"
        }
      ]
    },
    "relationship-between-adhd-and-sex": {
      id: 10,
      slug: "relationship-between-adhd-and-sex",
      title: "Unpacking the relationship between ADHD and sex",
      subtitle: "Understanding how ADHD can impact sexual relationships and intimacy, including strategies for improvement.",
      author: {
        name: "Brandy Chalmers, LPC",
        bio: "Brandy Chalmers is a licensed professional counselor specializing in ADHD and relationship counseling.",
        image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
      },
      date: "June 25, 2025",
      lastUpdated: "June 25, 2025",
      categories: ["ADHD", "Relationships", "Intimacy"],
      featuredImage: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      clinicallyReviewedBy: {
        name: "Dr. Michael Chen",
        credentials: "Board-Certified Psychiatrist",
        bio: "Dr. Chen specializes in ADHD diagnosis and medication management."
      },
      keyTakeaways: [
        "ADHD can impact sexual relationships in various ways",
        "Common challenges include impulsivity and attention difficulties",
        "Open communication with partners is essential",
        "Treatment can help improve relationship satisfaction",
        "Professional support can address specific concerns"
      ],
      content: [
        {
          type: "section",
          heading: "How ADHD affects sexual relationships",
          content: "ADHD can impact sexual relationships through various mechanisms, including impulsivity, attention difficulties, emotional dysregulation, and challenges with routine and consistency. These factors can affect both sexual satisfaction and relationship dynamics."
        },
        {
          type: "section",
          heading: "Common challenges",
          content: "Common challenges include difficulty maintaining focus during intimate moments, impulsive sexual behaviors, inconsistent interest in sex, and challenges with emotional regulation that can affect intimacy."
        },
        {
          type: "section",
          heading: "The importance of communication",
          content: "Open, honest communication with partners about ADHD-related challenges is crucial. This includes discussing needs, preferences, and any difficulties experienced, as well as working together to find solutions."
        },
        {
          type: "section",
          heading: "Strategies for improvement",
          content: "Strategies may include creating routines, managing distractions, practicing mindfulness, and finding ways to increase focus and presence during intimate moments. Treatment for ADHD can also help improve relationship satisfaction."
        },
        {
          type: "section",
          heading: "Seeking professional help",
          content: "If ADHD is significantly impacting your sexual relationships, consider seeking help from a therapist who specializes in ADHD and relationships. They can provide specific strategies and support for addressing these challenges."
        },
        {
          type: "section",
          heading: "Building intimacy",
          content: "Despite challenges, people with ADHD can have fulfilling sexual relationships. The key is understanding how ADHD affects you personally, communicating openly with partners, and finding strategies that work for your unique situation."
        }
      ],
      relatedPosts: [
        {
          id: 2,
          title: "Four tips for talking to a psychiatrist about ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/rightside5th.png",
          slug: "four-tips-talking-psychiatrist-adhd"
        },
        {
          id: 1,
          title: "Five ways to cope with burnout when parenting a child with ADHD",
          author: "Liz Talago",
          date: "June 27, 2025",
          image: "/kids.png",
          slug: "five-ways-cope-burnout-parenting-adhd"
        },
        {
          id: 7,
          title: "Embracing emotional vulnerability",
          author: "Linda Childers",
          date: "June 26, 2025",
          image: "/hero.png",
          slug: "embracing-emotional-vulnerability"
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const post = blogPosts[slug];
      if (post) {
        setBlogPost(post);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/blog" className="hover:text-indigo-600">Blog</Link>
            <span>/</span>
            {blogPost.categories.map((category, index) => (
              <span key={category}>
                <span className="hover:text-indigo-600 cursor-pointer">{category}</span>
                {index < blogPost.categories.length - 1 && <span> / </span>}
              </span>
            ))}
          </div>
        </nav>

        {/* Title & Metadata */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {blogPost.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {blogPost.subtitle}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span>By {blogPost.author.name}</span>
            <span>•</span>
            <span>Published {blogPost.date}</span>
            <span>•</span>
            <span>Last updated {blogPost.lastUpdated}</span>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            Clinically reviewed by <span className="font-medium">{blogPost.clinicallyReviewedBy.name}</span>, {blogPost.clinicallyReviewedBy.credentials}
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-96 md:h-[500px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={blogPost.featuredImage}
            alt={blogPost.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Key Takeaways */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Takeaways</h2>
          <ul className="space-y-2">
            {blogPost.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area - Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Side - Main Content */}
          <div className="flex-1">
            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {blogPost.content.map((section, index) => (
                <div key={index} className="mb-8">
                  {section.type === "section" && (
                    <>
                      {section.heading && (
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                          {section.heading}
                        </h2>
                      )}
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {section.content}
                      </p>
                    </>
                  )}
                  
                  {section.type === "list" && (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">
                        {section.heading}
                      </h3>
                      <ul className="space-y-3 mb-6">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <span className="text-indigo-600 mr-3 mt-1">•</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-lg mb-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The care you need, when you need it
              </h3>
              <p className="text-gray-700 mb-6">
                Learn how Little Care can support your mental health journey with licensed therapists who specialize in ADHD and family therapy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Find a Therapist
                </button>
                <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            {/* Author Box */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={blogPost.author.image}
                    alt={blogPost.author.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{blogPost.author.name}</h4>
                  <p className="text-gray-700">{blogPost.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Clinical Reviewer */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Clinical Reviewer</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold text-lg">
                    {blogPost.clinicallyReviewedBy.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{blogPost.clinicallyReviewedBy.name}</h4>
                  <p className="text-gray-600 mb-2">{blogPost.clinicallyReviewedBy.credentials}</p>
                  <p className="text-gray-700">{blogPost.clinicallyReviewedBy.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - More From Little Care */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">More From Little Care</h3>
              <div className="space-y-4">
                {blogPost.relatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="relative h-32">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-2">
                          {post.author} • {post.date}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
