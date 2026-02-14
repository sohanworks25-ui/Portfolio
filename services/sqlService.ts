
import { PortfolioData } from '../types';

/**
 * Escapes a string for SQL safety
 */
const esc = (str: string | undefined): string => {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
};

/**
 * Generates a full SQL migration script based on the current data state
 */
export const generateDataExportSQL = (data: PortfolioData): string => {
  const timestamp = new Date().toISOString();
  
  let sql = `-- Portfolio Data Export\n`;
  sql += `-- Generated on: ${timestamp}\n\n`;

  sql += `BEGIN;\n\n`;

  // 1. Site Settings
  sql += `-- Update Site Settings\n`;
  sql += `INSERT INTO site_settings (id, site_name, logo_text, meta_title, meta_description, keywords, favicon_url, total_views)\n`;
  sql += `VALUES (1, ${esc(data.siteName)}, ${esc(data.logo)}, ${esc(data.seo.metaTitle)}, ${esc(data.seo.metaDescription)}, ${esc(data.seo.keywords)}, ${esc(data.seo.faviconUrl)}, ${data.analytics.totalViews})\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET\n`;
  sql += `  site_name = EXCLUDED.site_name, logo_text = EXCLUDED.logo_text, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description, keywords = EXCLUDED.keywords, favicon_url = EXCLUDED.favicon_url, total_views = EXCLUDED.total_views;\n\n`;

  // 2. Profile
  sql += `-- Profile Table\n`;
  sql += `TRUNCATE TABLE profiles CASCADE;\n`;
  sql += `INSERT INTO profiles (name, designation, bio, about_me, photo_url, resume_url, phone, email, years_of_experience)\n`;
  sql += `VALUES (${esc(data.profile.name)}, ${esc(data.profile.designation)}, ${esc(data.profile.bio)}, ${esc(data.profile.aboutMe)}, ${esc(data.profile.photoUrl)}, ${esc(data.profile.resumeUrl)}, ${esc(data.profile.phone)}, ${esc(data.profile.email)}, ${esc(data.profile.yearsOfExperience)});\n\n`;

  // 3. Projects
  if (data.projects.length > 0) {
    sql += `-- Projects & Tech Stack\n`;
    sql += `TRUNCATE TABLE projects CASCADE;\n`;
    data.projects.forEach(p => {
      sql += `WITH inserted_project AS (\n`;
      sql += `  INSERT INTO projects (title, description, image_url, category, live_link, github_link, is_published)\n`;
      sql += `  VALUES (${esc(p.title)}, ${esc(p.description)}, ${esc(p.image)}, ${esc(p.category)}, ${esc(p.liveLink)}, ${esc(p.githubLink)}, ${p.published})\n`;
      sql += `  RETURNING id\n`;
      sql += `)\n`;
      if (p.techStack && p.techStack.length > 0) {
        sql += `INSERT INTO project_tech_stack (project_id, tech_name) SELECT id, unnest(ARRAY[${p.techStack.map(t => esc(t)).join(', ')}]) FROM inserted_project;\n`;
      } else {
        sql += `SELECT id FROM inserted_project;\n`;
      }
    });
    sql += `\n`;
  }

  // 4. Skills
  if (data.skills.length > 0) {
    sql += `-- Skills\n`;
    sql += `TRUNCATE TABLE skills CASCADE;\n`;
    sql += `INSERT INTO skills (name, percentage)\nVALUES\n  `;
    sql += data.skills.map(s => `(${esc(s.name)}, ${s.percentage})`).join(',\n  ') + ';\n\n';
  }

  // 5. Messages
  if (data.messages.length > 0) {
    sql += `-- Contact Messages\n`;
    sql += `TRUNCATE TABLE messages CASCADE;\n`;
    sql += `INSERT INTO messages (sender_name, sender_email, subject, body, is_read, received_at)\nVALUES\n  `;
    sql += data.messages.map(m => `(${esc(m.name)}, ${esc(m.email)}, ${esc(m.subject)}, ${esc(m.message)}, ${m.read}, '${m.date}')`).join(',\n  ') + ';\n\n';
  }

  sql += `COMMIT;`;
  
  return sql;
};
