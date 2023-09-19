import { Loader2 } from "lucide-react";
import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="grid w-full place-items-center py-64 md:col-span-5">
      <Loader2 className="animate-spin text-white" size={80} />
    </div>
  );
};

export default loading;
