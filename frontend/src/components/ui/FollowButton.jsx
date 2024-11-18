import { Button } from "@/components/ui/button";
import { CoolMode } from "@/components/ui/cool-mode";

const FollowButton = () => {
    return (
        <div className="relative justify-center">
            <CoolMode>
                <Button className="text-xs px-4 h-fit bg-blue-600 font-semibold hover:bg-blue-500 rounded-lg cursor-pointer">Follow</Button>
            </CoolMode>
        </div>
    );
}

export default FollowButton