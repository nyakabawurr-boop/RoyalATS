/**
 * Base Template Component
 * All templates extend this base structure
 */

import { Resume } from '@/types/resume'
import { cn } from '@/lib/utils'

interface TemplateBaseProps {
  resume: Resume
  className?: string
}

export function TemplateBase({ resume, className }: TemplateBaseProps) {
  return (
    <div className={cn('resume-template', className)}>
      {/* This will be extended by specific templates */}
      <div className="resume-content">
        {/* Contact Header */}
        <div className="resume-header border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">{resume.contact.name || 'Your Name'}</h1>
          {resume.contact.headline && (
            <p className="text-lg text-gray-600 mb-3">{resume.contact.headline}</p>
          )}
          <div className="contact-info flex flex-wrap gap-3 text-sm text-gray-700">
            {resume.contact.email && <span>{resume.contact.email}</span>}
            {resume.contact.phone && <span>{resume.contact.phone}</span>}
            {resume.contact.location && <span>{resume.contact.location}</span>}
            {resume.contact.links.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {link.label || link.url}
              </a>
            ))}
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div className="resume-section mb-6">
            <h2 className="section-title text-xl font-bold mb-2 border-b pb-1">Professional Summary</h2>
            <p className="text-gray-700 whitespace-pre-line">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <div className="resume-section mb-6">
            <h2 className="section-title text-xl font-bold mb-4 border-b pb-1">Professional Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="experience-item mb-4">
                <div className="experience-header flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                  <span className="company font-semibold">{exp.company}</span>
                </div>
                <div className="experience-meta text-sm text-gray-600 mb-2">
                  <span>{exp.startDate}</span>
                  {exp.current ? (
                    <span> - Present</span>
                  ) : exp.endDate ? (
                    <span> - {exp.endDate}</span>
                  ) : null}
                  {exp.location && <span> | {exp.location}</span>}
                </div>
                <ul className="bullets list-disc list-inside space-y-1 ml-4">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-gray-700">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="resume-section mb-6">
            <h2 className="section-title text-xl font-bold mb-4 border-b pb-1">Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} className="education-item mb-2">
                <h3 className="font-semibold">{edu.degree}</h3>
                <div className="text-gray-700">
                  <span>{edu.school}</span>
                  {edu.graduationDate && <span> | {edu.graduationDate}</span>}
                  {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div className="resume-section mb-6">
            <h2 className="section-title text-xl font-bold mb-4 border-b pb-1">Skills</h2>
            {resume.skills.map((category) => (
              <div key={category.id} className="mb-2">
                {category.name && <h3 className="font-medium mb-1">{category.name}:</h3>}
                <span className="text-gray-700">{category.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <div className="resume-section mb-6">
            <h2 className="section-title text-xl font-bold mb-4 border-b pb-1">Projects</h2>
            {resume.projects.map((project) => (
              <div key={project.id} className="project-item mb-3">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="text-sm text-gray-600">Technologies: {project.technologies.join(', ')}</div>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                    {project.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div className="resume-section mb-6">
            <h2 className="section-title text-xl font-bold mb-4 border-b pb-1">Certifications</h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <span className="font-semibold">{cert.name}</span>
                <span className="text-gray-700"> - {cert.issuer}</span>
                {cert.date && <span className="text-gray-600"> | {cert.date}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Additional Sections */}
        {resume.additional.length > 0 && (
          <div className="resume-section mb-6">
            {resume.additional.map((section) => (
              <div key={section.id} className="mb-6">
                <h2 className="section-title text-xl font-bold mb-4 border-b pb-1">{section.title}</h2>
                <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-gray-700">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

