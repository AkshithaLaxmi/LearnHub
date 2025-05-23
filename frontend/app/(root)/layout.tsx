import { Toaster } from '@/components/ui/sonner'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <main>{children}</main>
            <Toaster richColors />
        </>
    )
}

export default layout