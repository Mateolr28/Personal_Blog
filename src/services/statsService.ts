import { projectService } from './projectService';
import { travelService } from './travelService';
import { aviationService } from './aviationService';
import { experienceService } from './experienceService';
import { technologyService } from './technologyService';
import { contactService } from './contactService';
import { DashboardStats } from '../types';

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const [projects, travels, aviationList, experiences, technologies, messages] = await Promise.all([
      projectService.getAll(false),
      travelService.getAll(false),
      aviationService.getAll(false),
      experienceService.getAll(),
      technologyService.getAll(),
      contactService.getAll(),
    ]);

    // Count photos across projects, travels, and aviation
    let photosCount = 0;
    projects.forEach((p) => {
      if (p.main_image) photosCount++;
      if (p.gallery) photosCount += p.gallery.length;
    });
    travels.forEach((t) => {
      if (t.main_image) photosCount++;
      if (t.gallery) photosCount += t.gallery.length;
    });
    aviationList.forEach((a) => {
      if (a.main_image) photosCount++;
      if (a.gallery) photosCount += a.gallery.length;
    });

    const unreadMessagesCount = messages.filter((m) => !m.read).length;

    return {
      projectsCount: projects.length,
      travelsCount: travels.length,
      aviationCount: aviationList.length,
      photosCount,
      experiencesCount: experiences.length,
      technologiesCount: technologies.length,
      unreadMessagesCount,
    };
  },

  async getStats(): Promise<DashboardStats> {
    return this.getDashboardStats();
  },
};
