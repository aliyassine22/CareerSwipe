// services/jobMatchingService.js

export function matchJobsToUser(user, jobs) {
      if (!user || !jobs) return [];
    
      const userSkills = user.skills.map(skill => skill.toLowerCase());
      const userExperienceLevel = user.experienceLevel?.toLowerCase();
      const userEducation = user.education?.toLowerCase();
    
      return jobs.filter(job => {
        // Match at least 1 skill
        const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
        const skillMatch = jobSkills.some(skill => userSkills.includes(skill));
    
        // Match experience level
        const experienceMatch = job.experienceLevel?.toLowerCase() === userExperienceLevel;
    
        // Match education (very soft match, just includes)
        const educationMatch = userEducation && job.educationRequired?.toLowerCase() && 
                                userEducation.includes(job.educationRequired.toLowerCase());
    
        // For now: only require skill match
        return skillMatch;
      });
    }

    
    