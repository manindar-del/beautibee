import { useRouter } from "next/navigation";

/**
 * UseRedirect is a function that returns a function that redirects to a path.
 * @returns An object with a redirect function.
 */
const useRedirect = (path) => {
  const router = useRouter();

  const redirect = () => {
    router.push(path);
  };
  return { redirect };
};

export default useRedirect;
