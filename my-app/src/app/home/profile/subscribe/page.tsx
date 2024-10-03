'use client'
import * as React from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Component() {
    const plans = [
        {
            name: "Basic",
            price: "$9.99",
            description: "Perfect for casual learners",
            features: [
                "100 minutes of subtitle translation per month",
                "5 supported languages",
                "Standard subtitle formats support",
                "24/7 email support"
            ]
        },
        {
            name: "Pro",
            price: "$19.99",
            description: "Ideal for regular language enthusiasts",
            features: [
                "500 minutes of subtitle translation per month",
                "20 supported languages",
                "Advanced subtitle formats support",
                "Priority email support",
                "Offline mode"
            ]
        },
        {
            name: "Ultimate",
            price: "$39.99",
            description: "For serious language learners",
            features: [
                "Unlimited subtitle translation",
                "All supported languages",
                "All subtitle formats support",
                "24/7 priority support",
                "Offline mode",
                "AI-powered learning recommendations",
                "Progress tracking"
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                        Choose Your Subtitle Learning Plan
                    </h2>
                    <p className="mt-4 text-xl text-muted-foreground">
                        Unlock the power of language learning through subtitles
                    </p>
                </div>
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}

                        >
                            <Card className="flex flex-col justify-between h-full">
                                <CardHeader>
                                    <CardTitle className={`text-2xl font-semibold ${plan.name === "Ultimate" ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text" : ""}`}>
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                                    <span className="text-muted-foreground"> / month</span>
                                    <ul className="mt-6 space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                                                <span className="ml-3 text-sm text-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                                        <Button className="w-full">Get Started</Button>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
