import React, { useState } from 'react';
import SignUp from './SignUp';
import RoleSelection from './RoleSelection';

interface AuthFlowProps {
  onAuthComplete: (userData: any, role: string) => void;
}

type AuthStep = 'signup' | 'role-selection' | 'complete';

const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthComplete }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('signup');
  const [userData, setUserData] = useState<any>(null);

  const handleSignUpSuccess = (data: any) => {
    setUserData(data);
    setCurrentStep('role-selection');
  };

  const handleRoleSelected = (role: string) => {
    setCurrentStep('complete');
    onAuthComplete(userData, role);
  };

  switch (currentStep) {
    case 'signup':
      return <SignUp onSignUpSuccess={handleSignUpSuccess} />;
    
    case 'role-selection':
      return <RoleSelection userData={userData} onRoleSelected={handleRoleSelected} />;
    
    default:
      return null;
  }
};

export default AuthFlow;