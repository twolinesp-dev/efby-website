import React from 'react';
import { getSiteSettings } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsManager from '@/components/admin/SettingsManager';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const settings = getSiteSettings();
  return <SettingsManager initialSettings={settings} />;
}
