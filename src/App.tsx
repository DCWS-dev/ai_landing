import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AdminPage } from './pages/AdminPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/admin/*" element={<AdminPage />} />
          </Routes>
        </AuthProvider>
      </ContentProvider>
    </BrowserRouter>
  );
}
