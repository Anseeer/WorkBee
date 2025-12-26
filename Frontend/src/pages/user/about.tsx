import { lazy } from "react"
const AboutPage = lazy(() => import("../../components/common/About"));

export const About = () => {
    return (
        <AboutPage />
    )
}