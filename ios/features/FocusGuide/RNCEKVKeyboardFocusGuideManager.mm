//
//  RNCEKVKeyboardFocusGuideManager.mm
//  react-native-external-keyboard
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import "RNCEKVKeyboardFocusGuideManager.h"
#import "RNCEKVKeyboardFocusGuide.h"

@implementation RNCEKVKeyboardFocusGuideManager

RCT_EXPORT_MODULE(KeyboardFocusGuide)

- (UIView *)view
{
  return [[RNCEKVKeyboardFocusGuide alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(preferredFocusOrderId, NSString, RNCEKVKeyboardFocusGuide)
{
  NSString *value = json ? [RCTConvert NSString:json] : nil;
  [view setPreferredFocusOrderId:value];
}

RCT_CUSTOM_VIEW_PROPERTY(enabled, BOOL, RNCEKVKeyboardFocusGuide)
{
  [view setGuideEnabled:json ? [RCTConvert BOOL:json] : YES];
}

RCT_CUSTOM_VIEW_PROPERTY(guideMask, NSInteger, RNCEKVKeyboardFocusGuide)
{
  [view setGuideMask:json ? [RCTConvert NSInteger:json] : RNCEKVGuideMaskDefault];
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RNCEKVKeyboardFocusGuide)
{
  NSString *value = json ? [RCTConvert NSString:json] : nil;
  [view setCustomGroupId:value.length > 0 ? value : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(uniqueGroupIdentifierEnabled, BOOL, RNCEKVKeyboardFocusGuide)
{
  [view setUniqueGroupIdentifierEnabled:json ? [RCTConvert BOOL:json] : NO];
}

@end
