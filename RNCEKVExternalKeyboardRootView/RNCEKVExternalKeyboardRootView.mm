//
//  RNCEKVExternalKeyboardRootView.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 13/08/2024.
//

#import <Foundation/Foundation.h>

#import "RNCEKVExternalKeyboardRootView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNA11yOrderSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11yOrderSpec/EventEmitters.h>
#import <react/renderer/components/RNA11yOrderSpec/Props.h>
#import <react/renderer/components/RNA11yOrderSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNCEKVExternalKeyboardRootView () <RCTA11yIndexViewViewProtocol>

@end

#endif



@implementation RNCEKVExternalKeyboardRootView

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
  
}
#else
- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    if (newSuperview == nil) {
     
    }
}
#endif


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<A11yOrderViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const A11yOrderViewProps>();
        _props = defaultProps;
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<A11yOrderViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<A11yOrderViewProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(oldViewProps.orderKey != newViewProps.orderKey) {
          [self setOrderKey:  [NSString stringWithUTF8String:newViewProps.orderKey.c_str()]];
         }
}

Class<RCTComponentViewProtocol> A11yOrderViewCls(void)
{
    return RNAOA11yOrderView.class;
}

#endif

@end
