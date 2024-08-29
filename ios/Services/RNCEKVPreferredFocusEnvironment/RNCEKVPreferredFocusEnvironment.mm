//
//  RNCEKVPreferredFocusEnvironment.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 14/08/2024.
//

#import "RNCEKVPreferredFocusEnvironment.h"
#import "RNCEKVExternalKeyboardRootView.h"

@implementation RNCEKVPreferredFocusEnvironment {
    NSMutableDictionary<NSString*, RNCEKVExternalKeyboardRootView*> *_views;
    UIView *_autoFocusView;
}

+ (instancetype)sharedInstance {
    static RNCEKVPreferredFocusEnvironment *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (id)init {
  if (self = [super init]) {
      _views = [NSMutableDictionary dictionary];
  }
   
  return self;
}

- (void)storeRootView:(NSString*)viewId withView:(RNCEKVExternalKeyboardRootView*) view; {
    RNCEKVExternalKeyboardRootView* keyboardRootView = [_views objectForKey: viewId];
    if(!keyboardRootView) {
        [_views setObject: view forKey:viewId];
        keyboardRootView = view;
    }
//    if(_autoFocusView) {
//        [keyboardRootView setAutoFocus: _autoFocusView];
//    }
}

- (void)setAutoFocus:(UIView*)view withRootId:(NSString*)rootId {
    RNCEKVExternalKeyboardRootView* keyboardRootView = [_views objectForKey: rootId];
    if(keyboardRootView && keyboardRootView.window) {
        [keyboardRootView focusView: view];
    } else {
        [keyboardRootView setAutoFocus: view];
//        _autoFocusView = view;
    }
}

- (void)detachRootView:(NSString*)viewId {
    [_views removeObjectForKey: viewId];
}

- (void)focus:(UIView*)view withRootId:(NSString*)rootId {
    RNCEKVExternalKeyboardRootView* keyboardRootView = [_views objectForKey: rootId];
    if(keyboardRootView) {
        [keyboardRootView focusView: view];
    }
}


@end
