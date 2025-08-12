//
//  RNCEKVGroupIdentifierDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>

#import "RNCEKVGroupIdentifierDelegate.h"
#import "RNCEKVFocusEffectUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTViewComponentView+RNCEKVExternalKeyboard.h"
#endif


@implementation RNCEKVGroupIdentifierDelegate {
  UIView<RNCEKVGroupIdentifierProtocol>* _delegate;
  NSString* _tagId;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVGroupIdentifierProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
  }
  return self;
}


-  (NSString*) getTagId {
  if(_tagId) {
    return _tagId;
  }

  NSUUID *uuid = [NSUUID UUID];
  NSString *uniqueID = [uuid UUIDString];
  _tagId = [NSString stringWithFormat:@"app.group.%@", uniqueID];

  return _tagId;
}


- (NSString*) getFocusGroupIdentifier {
  if (@available(iOS 14.0, *)) {
    if(_delegate.customGroupId) {
      return _delegate.customGroupId;
    }

    return [self getTagId];
  } else {
    return nil;
  }
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void) updateGroupIdentifier {
  if (@available(iOS 14.0, *)) {
    UIView* focus = [_delegate getFocusTargetView];

    NSString* identifier = [self getFocusGroupIdentifier];
    if([focus isKindOfClass:[RCTViewComponentView class]]) {
      ((RCTViewComponentView*)focus).rncekvCustomGroup = identifier;
    } else {
      focus.focusGroupIdentifier = identifier;
    }
  }
}

#else

- (void) updateGroupIdentifier {
  if (@available(iOS 14.0, *)) {
    UIView* focus = [_delegate getFocusTargetView];
    focus.focusGroupIdentifier = [self getFocusGroupIdentifier];
  }
}

#endif

- (void) clear {
  if (@available(iOS 14.0, *)) {
    UIView* focus = [_delegate getFocusTargetView];
    [self clearSubview: focus];
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)clearSubview: (UIView*_Nullable)subview {
  if(!subview) return;

  if (@available(iOS 14.0, *)) {

    if(subview) {
      if([subview isKindOfClass:[RCTViewComponentView class]]) {
        ((RCTViewComponentView*)subview).rncekvCustomGroup = nil;
      } else {
        subview.focusGroupIdentifier = nil;
      }
    }
  }
}
#else

- (void)clearSubview: (UIView*_Nullable)subview {
  if(!subview) return;

  if (@available(iOS 14.0, *)) {
    subview.focusGroupIdentifier = nil;
  }
}

#endif

@end
