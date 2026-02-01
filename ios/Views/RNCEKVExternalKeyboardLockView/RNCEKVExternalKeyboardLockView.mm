//
//  RNCEKVExternalKeyboardLockView.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 27/01/2026.
//

#import <Foundation/Foundation.h>


#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RNCEKVExternalKeyboardLockView.h"

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNExternalKeyboardViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/EventEmitters.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#import <react/renderer/components/RNExternalKeyboardViewSpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNCEKVExternalKeyboardLockView () <RCTExternalKeyboardLockViewViewProtocol>

@end

#endif



@implementation RNCEKVExternalKeyboardLockView


#ifdef RCT_NEW_ARCH_ENABLED

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ExternalKeyboardLockViewComponentDescriptor>();
}


- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ExternalKeyboardLockViewProps>();
    _props = defaultProps;
  }
  
  return self;
}

Class<RCTComponentViewProtocol> ExternalKeyboardLockViewCls(void)
{
  return RNCEKVExternalKeyboardLockView.class;
}

#endif

@end
