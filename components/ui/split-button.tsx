import { Button, ButtonProps } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SplitButtonProps
  extends Pick<ButtonProps, "variant" | "size" | "className"> {
  mainButtonText: string
  mainButtonHref?: string
  mainButtonOnClick?: () => void
  dropdownItems: {
    label: string
    onClick: () => void
  }[]
  showMainButton?: boolean
}

export function SplitButton({
  mainButtonText,
  mainButtonHref,
  mainButtonOnClick,
  dropdownItems,
  variant = "default",
  size = "default",
  className,
  showMainButton = true
}: SplitButtonProps) {
  const MainButtonContent = (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-r-none", className)}
      onClick={mainButtonOnClick}
    >
      {mainButtonText}
    </Button>
  )

  return (
    <DropdownMenu>
      <div className="flex">
        {showMainButton &&
          (mainButtonHref ? (
            <Link href={mainButtonHref}>{MainButtonContent}</Link>
          ) : (
            MainButtonContent
          ))}
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn(
              showMainButton
                ? "border-input rounded-l-none border-l px-2"
                : "px-2",
              variant === "outline" && "border-l-input",
              variant !== "outline" && "border-primary/20"
            )}
          >
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end">
        {dropdownItems.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
