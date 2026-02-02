'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ServiceGrid from "@/components/ServiceGrid";

export default function ServicesPage() {
    return (
        <div className="container py-24 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl font-bold text-slate-800 mb-4">خدماتنا</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    نقدم لك مجموعة شاملة من خدمات تنظيم المناسبات في حائل
                </p>
            </motion.div>

            <ServiceGrid />
        </div>
    );
}
