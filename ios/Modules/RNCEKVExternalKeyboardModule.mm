//
//  RNCEKVExternalKeyboardModule.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 16/03/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVExternalKeyboardModule.h"

#import "RNExternalKeyboardViewSpec/RNExternalKeyboardViewSpec.h"
using namespace facebook::react;

@implementation RNCEKVExternalKeyboardModule


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_MODULE(ExternalKeyboardModule);


RCT_EXPORT_METHOD(dismissKeyboard) {
  
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeExternalKeyboardModuleSpecJSI>(params);
}
@end

