import { SpinnerGap } from "@phosphor-icons/react";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center p-5 fs-5 fw-semibold text-white">
      <SpinnerGap className="spinner me-1" size={24} weight="bold" />
      <p className="mb-0">Loading...</p>
    </div>
  );
};

export default Loading;
