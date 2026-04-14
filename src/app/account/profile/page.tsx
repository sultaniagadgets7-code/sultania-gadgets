import type { Metadata } from 'next';
import { getUserProfile } from '@/lib/queries';
import { ProfileForm } from './ProfileForm';

export const metadata: Metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const data = await getUserProfile();
  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">{data?.email}</p>
      <ProfileForm profile={data?.profile} />
    </div>
  );
}
