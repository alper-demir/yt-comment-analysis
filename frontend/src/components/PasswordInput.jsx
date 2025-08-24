import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

const PasswordInput = ({ id, value, onChange, placeholder, label }) => {
    const [show, setShow] = useState(false)

    return (
        <div className="space-y-2">
            {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
            <div className="relative">
                <Input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="pr-10"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                    onClick={() => setShow(!show)}
                >
                    {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}

export default PasswordInput