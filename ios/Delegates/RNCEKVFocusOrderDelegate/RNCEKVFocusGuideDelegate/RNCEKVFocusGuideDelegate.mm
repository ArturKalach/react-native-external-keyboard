//
//  RNCEKVFocusGuideDelegate.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 16/07/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusGuideDelegate.h"

@implementation RNCEKVFocusGuideDelegate{
  BOOL _isFocused;
  UIView<RNCEKVFocusOrderProtocol>* _delegate;
  NSMutableDictionary<NSNumber *, UIFocusGuide*> *_sides;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
    _isFocused = NO;
    _sides = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)setGuideFor:(RNCEKVFocusGuideDirection)direction withView:(UIView *)view {
  if (!view) return;

  [self removeGuideFor: direction];
  _sides[@(direction)] = [RNCEKVFocusGuideHelper setGuideForDirection: direction
                                        inView:_delegate
                                     focusView: view
                                       enabled: _isFocused];
}

- (void)removeGuideFor:(RNCEKVFocusGuideDirection)direction {
  if (_sides[@(direction)]) {
    [_delegate removeLayoutGuide: _sides[@(direction)]];
    _sides[@(direction)] = nil;
  }
}

- (void)setIsFocused:(BOOL)value {
  _isFocused = value;

  for (NSNumber *key in _sides) {
    _sides[key].enabled = value;
  }
}

@end
