export type Scheme = {
    id: string;
    name: string;
    state: string;
    ministry: string;
    tags: string[];
    eligibility: string;
    benefit: string;
    details: string;
    lastDate: string;
    link: string;
    application_process: string;
    documents_required: string;
    faqs: { question: string; answer: string }[];
    sources_and_resources: string[];
}