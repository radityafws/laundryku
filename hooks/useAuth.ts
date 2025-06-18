import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser, logoutUser, getCurrentUser, verifyToken, LoginCredentials } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    },
    onError: (error: Error) => {
      console.error('Login error:', error.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login
      router.push('/admin/login');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVerifyToken = () => {
  return useQuery({
    queryKey: ['verify-token'],
    queryFn: verifyToken,
    retry: false,
    staleTime: 0,
  });
};