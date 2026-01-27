//
//  RNCEKVExternalKeyboardModule.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 16/03/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVExternalKeyboardModule.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNExternalKeyboardViewSpec/RNExternalKeyboardViewSpec.h"
using namespace facebook::react;

#endif

@implementation RNCEKVExternalKeyboardModule


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_MODULE(ExternalKeyboardModule);


RCT_EXPORT_METHOD(dismissKeyboard) {
  
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeExternalKeyboardModuleSpecJSI>(params);
}
#endif
@end

