//
//  RNCEKVFocusService.mm
//  react-native-external-keyboard
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "RNCEKVFocusService.h"

@interface RNCEKVFocusService ()
@property (nonatomic, weak) UIView *lastFocusedView;
@property (nonatomic, weak, readwrite, nullable) UIView *previousFocusedView;
@property (nonatomic, strong) NSHashTable<UIView<RNCEKVFocusServiceSubscriber> *> *subscribers;
@end

@implementation RNCEKVFocusService

+ (instancetype)sharedService {
  static RNCEKVFocusService *service = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    service = [[RNCEKVFocusService alloc] init];
  });
  return service;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _subscribers = [NSHashTable weakObjectsHashTable];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(accessibilityElementFocused:)
                                                 name:UIAccessibilityElementFocusedNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (UIView *)accessibilityElementFor:(UIView *)view {
  for (UIView *candidate = view; candidate; candidate = candidate.superview) {
    if (candidate.isAccessibilityElement) return candidate;
  }
  return view;
}

- (void)focus:(UIView *)view {
  if (!view) return;
  UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, [RNCEKVFocusService accessibilityElementFor:view]);
}

- (void)subscribe:(UIView<RNCEKVFocusServiceSubscriber> *)subscriber {
  @synchronized (self) {
    [self.subscribers addObject:subscriber];
  }
}

- (void)unsubscribe:(UIView<RNCEKVFocusServiceSubscriber> *)subscriber {
  @synchronized (self) {
    [self.subscribers removeObject:subscriber];
  }
}

- (void)accessibilityElementFocused:(NSNotification *)notification {
  @try {
    id focusedElement = notification.userInfo[UIAccessibilityFocusedElementKey];
    if ([focusedElement isKindOfClass:[UIAccessibilityElement class]]) {
      focusedElement = ((UIAccessibilityElement *)focusedElement).accessibilityContainer;
    }
    if (![focusedElement isKindOfClass:[UIView class]]) {
      return;
    }
    if (self.lastFocusedView && self.lastFocusedView != focusedElement) {
      for (UIView<RNCEKVFocusServiceSubscriber> *subscriber in self.subscribers) {
        if ([self.lastFocusedView isDescendantOfView:subscriber]) {
          [subscriber accessibilityElementDidUnfocused:self.lastFocusedView];
        }
      }
    }
    if (self.lastFocusedView != focusedElement) {
      self.previousFocusedView = self.lastFocusedView;
    }
    self.lastFocusedView = focusedElement;
    for (UIView<RNCEKVFocusServiceSubscriber> *subscriber in self.subscribers) {
      if ([focusedElement isDescendantOfView:subscriber]) {
        [subscriber accessibilityElementDidBecomeFocused:focusedElement];
      }
    }
  }
  @catch (NSException *exception) {
    self.lastFocusedView = nil;
  }
}


@end
