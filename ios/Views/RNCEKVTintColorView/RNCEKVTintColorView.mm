//
//  TintColorView.m
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#import "RNCEKVTintColorView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import "RNCEKVHeaders.h"

#import "RCTFabricComponentsPlugins.h"
#import "RNCEKVFabricEventHelper.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNCEKVTintColorView () <RCTTintColorViewViewProtocol>

@end

#endif

@implementation RNCEKVTintColorView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const TintColorViewProps>();
        _props = defaultProps;
#endif
    }
    
    return self;
}


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<TintColorViewComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<TintColorViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<TintColorViewProps const>(props);

    if(oldViewProps.tintColor != newViewProps.tintColor) {
        self.tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    }
}


Class<RCTComponentViewProtocol> TintColorViewCls(void)
{
    return RNCEKVTintColorView.class;
}


#endif



@end




