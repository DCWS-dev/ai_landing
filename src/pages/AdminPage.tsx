import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminLogin } from '../components/admin/AdminLogin';
import { HeroEditor } from '../components/admin/editors/HeroEditor';
import { ProblemsEditor } from '../components/admin/editors/ProblemsEditor';
import { AudienceEditor } from '../components/admin/editors/AudienceEditor';
import { FormatEditor } from '../components/admin/editors/FormatEditor';
import { ProgramEditor } from '../components/admin/editors/ProgramEditor';
import { BenefitsEditor } from '../components/admin/editors/BenefitsEditor';
import { SpeakerEditor } from '../components/admin/editors/SpeakerEditor';
import { TestimonialsEditor } from '../components/admin/editors/TestimonialsEditor';
import { PricingEditor } from '../components/admin/editors/PricingEditor';
import { FAQEditor } from '../components/admin/editors/FAQEditor';
import { UpsellEditor } from '../components/admin/editors/UpsellEditor';
import { FooterEditor } from '../components/admin/editors/FooterEditor';
import { UsersViewer } from '../components/admin/editors/UsersViewer';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const { resetContent } = useContent();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard onReset={resetContent} />} />
        <Route path="hero" element={<HeroEditor />} />
        <Route path="problems" element={<ProblemsEditor />} />
        <Route path="audience" element={<AudienceEditor />} />
        <Route path="format" element={<FormatEditor />} />
        <Route path="program" element={<ProgramEditor />} />
        <Route path="benefits" element={<BenefitsEditor />} />
        <Route path="speaker" element={<SpeakerEditor />} />
        <Route path="testimonials" element={<TestimonialsEditor />} />
        <Route path="pricing" element={<PricingEditor />} />
        <Route path="faq" element={<FAQEditor />} />
        <Route path="upsell" element={<UpsellEditor />} />
        <Route path="footer" element={<FooterEditor />} />
        <Route path="users" element={<UsersViewer />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
