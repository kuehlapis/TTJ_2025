import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Lead AI Researcher",
    bio: "PhD in Computer Vision from Stanford. Specialized in LLM applications for UI analysis and automated testing.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=300&h=300&fit=crop&crop=face",
    links: {
      linkedin: "https://linkedin.com/in/sarahchen",
      github: "https://github.com/sarahchen",
      email: "sarah@uifeedback.ai"
    }
  },
  {
    name: "Marcus Rodriguez",
    role: "Frontend Architect", 
    bio: "Full-stack engineer with 8+ years building scalable web applications. Expert in React, TypeScript, and modern UI frameworks.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    links: {
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      github: "https://github.com/marcusrod",
      website: "https://marcusdev.io"
    }
  },
  {
    name: "Aisha Patel",
    role: "UX Research Lead",
    bio: "Human-computer interaction expert focusing on accessibility and user experience optimization. Former Google UX researcher.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    links: {
      linkedin: "https://linkedin.com/in/aishapatel",
      email: "aisha@uifeedback.ai",
      website: "https://aishadesign.com"
    }
  },
  {
    name: "Dr. James Wilson",
    role: "Machine Learning Engineer",
    bio: "AI/ML specialist with expertise in computer vision and natural language processing. Former researcher at Microsoft Research.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    links: {
      linkedin: "https://linkedin.com/in/jameswilson",
      github: "https://github.com/jwilson",
      email: "james@uifeedback.ai"
    }
  }
];

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            About UI Feedback System
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We're revolutionizing automated UI testing with advanced LLM technology. Our mission is to make 
            web applications more consistent, accessible, and user-friendly through intelligent analysis.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Traditional GUI automation struggles with dynamic changes, anomalies, and domain-specific contexts. 
                We go beyond simple element localization to provide comprehensive analysis of consistency, 
                exception handling, and efficiency.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-success mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Sites Analyzed</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-accent mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Companies Served</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{member.role}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex gap-2">
                    {member.links.linkedin && (
                      <a href={member.links.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.links.github && (
                      <a href={member.links.github} className="text-muted-foreground hover:text-primary transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {member.links.email && (
                      <a href={`mailto:${member.links.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {member.links.website && (
                      <a href={member.links.website} className="text-muted-foreground hover:text-primary transition-colors">
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Our Technology</CardTitle>
            <CardDescription>
              Built with cutting-edge AI and modern web technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">AI & Machine Learning</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Large Language Models</Badge>
                  <Badge variant="outline">Computer Vision</Badge>
                  <Badge variant="outline">Natural Language Processing</Badge>
                  <Badge variant="outline">Deep Learning</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Web Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">Node.js</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;