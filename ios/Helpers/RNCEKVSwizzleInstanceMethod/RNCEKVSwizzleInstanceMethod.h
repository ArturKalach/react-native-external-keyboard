//
//  RNCEKVSwizzleInstanceMethod.h
//  Pods
//
//  Created by Artur Kalach on 12/08/2025.
//

#ifndef RNCEKVSwizzleInstanceMethod_h
#define RNCEKVSwizzleInstanceMethod_h

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

void RNCEKVSwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector);

#endif /* RNCEKVSwizzleInstanceMethod_h */
