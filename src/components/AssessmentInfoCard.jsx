"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const AssessmentBookingModal = dynamic(() => import('@/components/AssessmentBookingModal'), { ssr: false });

export default function AssessmentInfoCard({ cmsData = {} }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const {
    title = 'Assessment Overview',
    description = 'This assessment is designed to understand the child\'s needs and strengths. The content here is editable in CMS.',
    sessionsInfo = 'One assessment is conducted as 3 sessions scheduled on different dates/times. Available doctors will be assigned to each session.',
    typesHeading = 'Assessment types',
    certifiedLabel = 'Certified',
    nonCertifiedLabel = 'Non-certified',
    slug,
    id, // Assessment ID from database
    assigned_doctor_ids = []
  } = cmsData;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 mt-8 md:mt-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      >
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">{title}</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">{description}</p>
              <div className="text-sm md:text-base text-gray-800 leading-relaxed">
                {sessionsInfo}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">{typesHeading}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1">{certifiedLabel}</span>
                  <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1">{nonCertifiedLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
      {open && (
        <AssessmentBookingModal
          open={open}
          onClose={()=> setOpen(false)}
          assessment={{
            id, // Pass assessment ID
            slug, // Pass assessment slug
            hero_title: title,
            assessment_card_title: title,
            assessment_card_description: description,
            assessment_card_sessions_info: sessionsInfo,
          }}
          doctorIds={assigned_doctor_ids}
        />
      )}
    </div>
  );
}


