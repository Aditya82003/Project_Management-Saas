import type { FC } from "react"
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
interface EmojiPickerComponentProps {
    onSelectEmoji: (emoji: string) => void
}
const EmojiPickerComponent: FC<EmojiPickerComponentProps> = ({ onSelectEmoji }) => {

    const handleEmojiSelect = (emoji:{emoji:string}) => {
        console.log(emoji, "emoji")
        onSelectEmoji(emoji.emoji)
    }
    return (
        <div className="relative w-full !max-w-8">
            <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                emojiStyle={EmojiStyle.NATIVE}
            />
        </div>
    )
}

export default EmojiPickerComponent